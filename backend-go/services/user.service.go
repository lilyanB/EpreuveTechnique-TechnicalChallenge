package services

import (
	"backend_go/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserService interface {
	updateTransaction(*models.User, string, int, string, string, int, string)
	GetAll() ([]*models.User, error)
	GetUser(*string) ([]*models.User, error)
	GetUserByID(primitive.ObjectID) (*models.User, error)
	GetTransactions(primitive.ObjectID) ([]models.Transaction, error)
	GetAccounts(primitive.ObjectID) ([]models.Account, error)
	CreateUser(*models.User) error
	UpdateUser(*models.User) error
	SetOverdraft(primitive.ObjectID, *int) error
	DepositAmount(primitive.ObjectID, *string, *int) error
	WithdrawAmount(primitive.ObjectID, *string, *int) error
	TransferAmount(*string, *string, *int, primitive.ObjectID) error
	DeleteUser(primitive.ObjectID) error
}
