import { Option, Maybe } from 'core/models';
import { SpecialEdition, Audience } from 'core/models/generated';
import { editionOptions, audienceOptions } from 'core/global';

export const removeTypeName = ({ __typename, ...o }: any = {}) => o;

export const typedToOptions = (options: Option[], typed: Maybe<Maybe<{ type }>[]>) => {
  if (!typed) {
    return [];
  }

  const types = typed.map(t => t?.type);
  return options.filter(o => types.includes(o.value));
};

export const getEditionOptions = (editions: Maybe<Maybe<SpecialEdition>[]>) => {
  return typedToOptions(editionOptions, editions);
};

export const getAudienceOptions = (audiences: Maybe<Maybe<Audience>[]>) => {
  return typedToOptions(audienceOptions, audiences);
};
