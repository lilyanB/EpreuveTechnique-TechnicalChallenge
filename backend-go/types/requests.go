package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type SetOverdraftRequest struct {
	ID        primitive.ObjectID `json:"id"`
	Overdraft int                `json:"overdraft"`
}

type TransferRequest struct {
	ID     primitive.ObjectID `json:"id"`
	From   string             `json:"from"`
	To     string             `json:"to"`
	Amount int                `json:"amount"`
}

type DepositRequest struct {
	ID     primitive.ObjectID `json:"id"`
	To     string             `json:"to"`
	Amount int                `json:"amount"`
}

type WithdrawRequest struct {
	ID     primitive.ObjectID `json:"id"`
	To     string             `json:"to"`
	Amount int                `json:"amount"`
}
