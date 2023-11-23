package controllers

import (
	"backend_go/models"
	"backend_go/services"
	"backend_go/types"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserController struct {
	UserService services.UserService
}

func New(userservice services.UserService) UserController {
	return UserController{
		UserService: userservice,
	}
}

func (uc *UserController) CreateUser(ctx *gin.Context) {
	var user models.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	err := uc.UserService.CreateUser(&user)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (uc *UserController) GetUser(ctx *gin.Context) {
	var username string = ctx.Param("name")
	user, err := uc.UserService.GetUser(&username)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, user)
}

func (uc *UserController) GetUserByID(ctx *gin.Context) {
	userID := ctx.Param("id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid user ID"})
		return
	}
	user, err := uc.UserService.GetUserByID(objectID)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (uc *UserController) GetTransactions(ctx *gin.Context) {
	userID := ctx.Param("id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid user ID"})
		return
	}
	user, err := uc.UserService.GetTransactions(objectID)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (uc *UserController) GetAll(ctx *gin.Context) {
	users, err := uc.UserService.GetAll()
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, users)
}

func (uc *UserController) GetAccounts(ctx *gin.Context) {
	userID := ctx.Param("id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid user ID"})
		return
	}
	user, err := uc.UserService.GetAccounts(objectID)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (uc *UserController) UpdateUser(ctx *gin.Context) {
	var user models.User
	if err := ctx.ShouldBindJSON(&user); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	err := uc.UserService.UpdateUser(&user)
	if err != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (uc *UserController) DeleteUser(ctx *gin.Context) {
	userID := ctx.Param("id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid user ID"})
		return
	}
	deleteErr := uc.UserService.DeleteUser(objectID)
	if deleteErr != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": deleteErr.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (uc *UserController) TransferAmount(ctx *gin.Context) {
	var transferRequest types.TransferRequest
	if err := ctx.ShouldBindJSON(&transferRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON payload"})
		return
	}
	errTransfer := uc.UserService.TransferAmount(&transferRequest.From, &transferRequest.To, &transferRequest.Amount, transferRequest.ID)
	if errTransfer != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": errTransfer.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (uc *UserController) DepositAmount(ctx *gin.Context) {
	var depositRequest types.DepositRequest
	if err := ctx.ShouldBindJSON(&depositRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON payload"})
		return
	}
	errTransfer := uc.UserService.DepositAmount(depositRequest.ID, &depositRequest.To, &depositRequest.Amount)
	if errTransfer != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": errTransfer.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (uc *UserController) WithdrawAmount(ctx *gin.Context) {
	var withdrawRequest types.WithdrawRequest
	if err := ctx.ShouldBindJSON(&withdrawRequest); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON payload"})
		return
	}
	errTransfer := uc.UserService.WithdrawAmount(withdrawRequest.ID, &withdrawRequest.To, &withdrawRequest.Amount)
	if errTransfer != nil {
		ctx.JSON(http.StatusBadGateway, gin.H{"message": errTransfer.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func (uc *UserController) RegisterUserRoutes(rg *gin.RouterGroup) {
	userroute := rg.Group("/user")
	userroute.POST("/create", uc.CreateUser)
	userroute.GET("/get/:name", uc.GetUser)
	userroute.GET("/getById/:id", uc.GetUserByID)
	userroute.GET("/getTransactions/:id", uc.GetTransactions)
	userroute.GET("/getall", uc.GetAll)
	userroute.GET("/getAccounts/:id", uc.GetAccounts)
	userroute.PATCH("/update", uc.UpdateUser)
	userroute.DELETE("/delete/:id", uc.DeleteUser)
	userroute.POST("/transfer", uc.TransferAmount)
	userroute.POST("/deposit", uc.DepositAmount)
	userroute.POST("/withdraw", uc.WithdrawAmount)
}
