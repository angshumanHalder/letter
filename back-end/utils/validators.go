package utils

import (
	"fmt"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

var (
	uni      *ut.UniversalTranslator
	validate *validator.Validate
)

func translateError(err error, trans ut.Translator) (errs []string) {
	if err == nil {
		return nil
	}

	validatorErrs := err.(validator.ValidationErrors)
	for _, e := range validatorErrs {
		translatedErrs := fmt.Sprintf(e.Translate(trans))
		errs = append(errs, translatedErrs)
	}
	return errs
}

func ValidateInput(s interface{}) []string {
	en := en.New()
	uni := ut.New(en, en)

	transEn, _ := uni.GetTranslator("en")

	validate = validator.New()
	en_translations.RegisterDefaultTranslations(validate, transEn)

	err := validate.Struct(s)
	errs := translateError(err, transEn)

	if errs != nil {
		return errs
	}
	return nil
}
