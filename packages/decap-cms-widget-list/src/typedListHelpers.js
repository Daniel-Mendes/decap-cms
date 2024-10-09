export const TYPES_KEY = 'types';
export const TYPE_KEY = 'typeKey';
export const DEFAULT_TYPE_KEY = 'type';

export function getTypedFieldForValue(field, value) {
  const typeKey = resolveFieldKeyType(field);
  const types = field.get(TYPES_KEY);
  const valueType = value.get(typeKey);
  return types.find(type => type.get('name') === valueType);
}

export function resolveFunctionForTypedField(field) {
  const typeKey = resolveFieldKeyType(field);
  const types = field.get(TYPES_KEY);
  return value => {
    const valueType = value.get(typeKey);
    return types.find(type => type.get('name') === valueType);
  };
}

export function resolveFieldKeyType(field) {
  return field.get(TYPE_KEY, DEFAULT_TYPE_KEY);
}

export function getErrorMessageForTypedFieldAndValue(field, value) {
  const keyType = resolveFieldKeyType(field);
  const type = value.get(keyType);
  const errorMessage = type
    ? `Error: item has illegal '${keyType}' property: '${type}'`
    : `Error: item has no '${keyType}' property`;
  return errorMessage;
}
