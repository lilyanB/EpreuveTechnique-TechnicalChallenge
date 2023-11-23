package services

import (
	"backend_go/models"
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserServiceImpl struct {
	usercollection *mongo.Collection
	ctx            context.Context
}

func NewUserService(usercollection *mongo.Collection, ctx context.Context) UserService {
	return &UserServiceImpl{
		usercollection: usercollection,
		ctx:            ctx,
	}
}

func (u *UserServiceImpl) updateTransaction(user *models.User, transactionType string, amount int, from string, to string, newBalance int, informations string) {
	transaction := models.Transaction{
		Type:         transactionType,
		Amount:       amount,
		Date:         time.Now(),
		From:         from,
		To:           to,
		NewBalance:   newBalance,
		Informations: informations,
	}

	user.Transactions = append(user.Transactions, transaction)

	filter := bson.D{primitive.E{Key: "name", Value: user.Name}}
	update := bson.D{
		primitive.E{Key: "$set", Value: bson.D{
			primitive.E{Key: "transactions", Value: user.Transactions},
		}},
	}

	_, err := u.usercollection.UpdateOne(u.ctx, filter, update)
	if err != nil {
		fmt.Println("Error updating user document:", err)
	}
}

func (u *UserServiceImpl) CreateUser(user *models.User) error {
	user.ID = primitive.NewObjectID()
	user.CreationDate = time.Now()
	_, err := u.usercollection.InsertOne(u.ctx, user)
	return err
}

func (u *UserServiceImpl) GetUser(name *string) ([]*models.User, error) {
	var users []*models.User

	query := bson.D{bson.E{Key: "name", Value: name}}
	cursor, err := u.usercollection.Find(u.ctx, query)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(u.ctx)

	for cursor.Next(u.ctx) {
		var user models.User
		err := cursor.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	if len(users) == 0 {
		return nil, errors.New("no users found with the given name")
	}

	return users, nil
}

func (u *UserServiceImpl) GetUserByID(userID primitive.ObjectID) (*models.User, error) {
	var user *models.User
	query := bson.D{bson.E{Key: "_id", Value: userID}}
	err := u.usercollection.FindOne(u.ctx, query).Decode(&user)
	return user, err
}

func (u *UserServiceImpl) GetTransactions(userID primitive.ObjectID) ([]models.Transaction, error) {
	var user *models.User
	query := bson.D{bson.E{Key: "_id", Value: userID}}
	err := u.usercollection.FindOne(u.ctx, query).Decode(&user)
	return user.Transactions, err
}

func (u *UserServiceImpl) GetAll() ([]*models.User, error) {
	var users []*models.User
	cursor, err := u.usercollection.Find(u.ctx, bson.D{{}})
	if err != nil {
		return nil, err
	}
	for cursor.Next(u.ctx) {
		var user models.User
		err := cursor.Decode(&user)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	cursor.Close(u.ctx)

	if len(users) == 0 {
		return nil, errors.New("documents not found")
	}
	return users, nil
}

func (u *UserServiceImpl) GetAccounts(userID primitive.ObjectID) ([]models.Account, error) {
	var user *models.User
	query := bson.D{bson.E{Key: "_id", Value: userID}}
	err := u.usercollection.FindOne(u.ctx, query).Decode(&user)
	return user.Account, err
}

func (u *UserServiceImpl) UpdateUser(user *models.User) error {
	filter := bson.D{primitive.E{Key: "name", Value: user.Name}}
	update := bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "name", Value: user.Name}, primitive.E{Key: "age", Value: user.Age}, primitive.E{Key: "account", Value: user.Account}, primitive.E{Key: "overdraft", Value: user.Overdraft}}}}
	result, _ := u.usercollection.UpdateOne(u.ctx, filter, update)
	if result.MatchedCount != 1 {
		return errors.New("no matched document found for update")
	}
	return nil
}

func (u *UserServiceImpl) DeleteUser(userID primitive.ObjectID) error {
	filter := bson.D{bson.E{Key: "_id", Value: userID}}
	result, _ := u.usercollection.DeleteOne(u.ctx, filter)
	if result.DeletedCount != 1 {
		return errors.New("no matched document found for delete")
	}
	return nil
}

func (u *UserServiceImpl) TransferAmount(from *string, to *string, amount *int, objectID primitive.ObjectID) error {
	filter := bson.D{{Key: "_id", Value: objectID}}
	var user models.User
	err := u.usercollection.FindOne(u.ctx, filter).Decode(&user)
	if err != nil {
		return errors.New("User not found")
	}

	var fromAccount *models.Account
	var toAccount *models.Account

	for i := range user.Account {
		if user.Account[i].Name == *from {
			fromAccount = &user.Account[i]
		}
		if user.Account[i].Name == *to {
			toAccount = &user.Account[i]
		}
	}

	if fromAccount == nil || toAccount == nil {
		return errors.New("Invalid account names")
	}

	if fromAccount.Amount < *amount {
		if fromAccount.Name == "courant" {
			if (fromAccount.Amount - *amount) < 0-user.Overdraft {
				return errors.New("Exceeded overdraft")
			}
		} else {
			return errors.New("Insufficient funds")
		}
	}

	fromAccount.Amount -= *amount
	toAccount.Amount += *amount

	updateFilter := bson.D{{Key: "_id", Value: objectID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "account", Value: user.Account}}}}

	_, err = u.usercollection.UpdateOne(u.ctx, updateFilter, update)
	if err != nil {
		return errors.New("Transfer failed")
	}
	u.updateTransaction(&user, "Transfer", *amount, fromAccount.Name, toAccount.Name, toAccount.Amount, fmt.Sprintf("Transfer %d from %s to %s", *amount, *from, *to))

	return nil
}

func (u *UserServiceImpl) DepositAmount(objectID primitive.ObjectID, accountName *string, amount *int) error {
	filter := bson.D{{Key: "_id", Value: objectID}}
	var user models.User
	err := u.usercollection.FindOne(u.ctx, filter).Decode(&user)
	if err != nil {
		return errors.New("User not found")
	}

	var targetAccount *models.Account
	for i := range user.Account {
		if user.Account[i].Name == *accountName {
			targetAccount = &user.Account[i]
			break
		}
	}

	if targetAccount == nil {
		return errors.New("Invalid account name")
	}

	targetAccount.Amount += *amount

	updateFilter := bson.D{{Key: "_id", Value: objectID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "account", Value: user.Account}}}}

	_, err = u.usercollection.UpdateOne(u.ctx, updateFilter, update)
	if err != nil {
		return errors.New("Deposit failed")
	}
	u.updateTransaction(&user, "Deposit", *amount, "External", targetAccount.Name, targetAccount.Amount, fmt.Sprintf("Deposit %d from %s to %s", *amount, "External", targetAccount.Name))

	return nil
}

func (u *UserServiceImpl) WithdrawAmount(objectID primitive.ObjectID, accountName *string, amount *int) error {
	filter := bson.D{{Key: "_id", Value: objectID}}
	var user models.User
	err := u.usercollection.FindOne(u.ctx, filter).Decode(&user)
	if err != nil {
		return errors.New("User not found")
	}

	var targetAccount *models.Account
	for i := range user.Account {
		if user.Account[i].Name == *accountName {
			targetAccount = &user.Account[i]
			break
		}
	}

	if targetAccount == nil {
		return errors.New("Invalid account name")
	}

	if targetAccount.Amount < *amount {
		if targetAccount.Name == "courant" {
			if targetAccount.Amount-*amount < 0-user.Overdraft {
				return errors.New("Exceeded overdraft")
			}
		} else {
			return errors.New("Insufficient funds")
		}
	}

	targetAccount.Amount -= *amount

	updateFilter := bson.D{{Key: "_id", Value: objectID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "account", Value: user.Account}}}}

	_, err = u.usercollection.UpdateOne(u.ctx, updateFilter, update)
	if err != nil {
		return errors.New("Deposit failed")
	}
	u.updateTransaction(&user, "Withdraw", *amount, targetAccount.Name, "External", targetAccount.Amount, fmt.Sprintf("Withdraw %d from %s to %s", *amount, targetAccount.Name, "External"))

	return nil
}
