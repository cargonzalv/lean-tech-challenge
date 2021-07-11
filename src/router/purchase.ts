import {Joi, Spec } from 'koa-joi-router';
import {SchemaMap} from 'joi';

import HELPER from './helper';
import PURCHASE_CONTROLLER from '../controllers/purchase';

class PurchaseRouter {
  private static userOutput: SchemaMap = {
    id: Joi.string(),
    fecha: Joi.date(),
    cantidad: Joi.number(),
    idProducto: Joi.number(),
    nombreProducto: Joi.string()
  };

  public static create:Spec = ({
    method: HELPER.methods.POST,
    path: '/registrar-compra',
    validate: {
      continueOnError: true,
      type: HELPER.contentType.JSON,
      body: Joi.object({
        fecha: Joi.date().max("now").required(),
        cantidad: Joi.number().required(),
        idProducto: Joi.number().required(),
        nombreProducto: Joi.string().min(2).max(HELPER.defaults.length).required(),
      }).options({stripUnknown: true}),
      output: Object.assign({}, HELPER.errorResponse(400), HELPER.validationErrorResponse(), {
        201: {
          body: Joi.object({
            code: 201,
            data: Joi.object(PurchaseRouter.userOutput)
          }).options({stripUnknown: false})
        }
      })
    },
    handler: [HELPER.validation, PURCHASE_CONTROLLER.create]
  });

  public static read:Spec = ({
    method: HELPER.methods.GET,
    path: '/purchase/:id',
    validate: {
      continueOnError: true,
      params: Joi.object({
        id: Joi.string().regex(HELPER.mongoObjectRegEx)
      }),
      output: Object.assign({}, HELPER.errorResponse(403), HELPER.errorResponse(400), HELPER.validationErrorResponse(), {
        200: {
          body: Joi.object({
            code: 200,
            data: Joi.object(PurchaseRouter.userOutput)
          }).options({stripUnknown: true})
        }
      })
    },
    handler: [HELPER.validation, PURCHASE_CONTROLLER.read]
  });
  public static getAll:Spec = ({
    method: HELPER.methods.GET,
    path: '/purchases',
    validate: {
      continueOnError: true,
      output: Object.assign({}, HELPER.errorResponse(403), HELPER.errorResponse(400), HELPER.validationErrorResponse(), {
        200: {
          body: Joi.object({
            code: 200,
            data: Joi.array().items(Joi.object(PurchaseRouter.userOutput))
          }).options({stripUnknown: true})
        }
      })
    },
    handler: [HELPER.validation, PURCHASE_CONTROLLER.getAll]
  });
}

export default PurchaseRouter;
