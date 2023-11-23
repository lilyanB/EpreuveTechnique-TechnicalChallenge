package utils

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetObjectIDFromParam(ctx *gin.Context, paramName string) (primitive.ObjectID, error) {
	paramValue := ctx.Param(paramName)
	objectID, err := primitive.ObjectIDFromHex(paramValue)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return objectID, nil
}
