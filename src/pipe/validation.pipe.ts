import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  HttpException,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { I18nRequestScopeService } from 'nestjs-i18n';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private i18nRequest: I18nRequestScopeService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No body submitted',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const formatErro = await this.formatErrors(errors);
      throw new HttpException(
        {
          code: HttpStatus.BAD_REQUEST,
          errors: formatErro,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private async formatErrors(errors: any[]) {
    let messages = [];
    for (let x = 0; x < errors.length; x++) {
      const err = errors[x];
      let key = '';
      let value = '';
      let value2 = '';
      if (err.contexts) {
        key = Object.keys(err.contexts)[0];
        value = err.contexts[key].value;
        value2 = err.contexts[key].value2;
      }
      for (let property in err.constraints) {
        messages.push({
          field: err.property,
          message: await this.i18nRequest.translate(
            `validation.${property.toUpperCase()}`,
            {
              args: {
                constraint1: value,
                constraint2: value2,
                property: err.property,
              },
            },
          ),
        });
      }
    }

    return messages;
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
