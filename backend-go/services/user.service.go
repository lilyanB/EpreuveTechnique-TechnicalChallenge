package services

import (
	"backend_go/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserService interface {
	updateTransaction(*models.User, string, int, string, string, int, string)
	CreateUser(*models.User) error
	GetUser(*string) ([]*models.User, error)
	GetUserByID(primitive.ObjectID) (*models.User, error)
	GetTransactions(primitive.ObjectID) ([]models.Transaction, error)
	GetAll() ([]*models.User, error)
	GetAccounts(primitive.ObjectID) ([]models.Account, error)
	UpdateUser(*models.User) error
	DeleteUser(primitive.ObjectID) error
	TransferAmount(*string, *string, *int, primitive.ObjectID) error
	DepositAmount(primitive.ObjectID, *string, *int) error
	WithdrawAmount(primitive.ObjectID, *string, *int) error
}
