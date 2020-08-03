import { Option } from 'core/models';
import { SpecialEdition, Audience, Subject } from 'core/models/generated';
import { editionOptions, audienceOptions } from 'core/global';

export const removeTypeName = ({ __typename, ...o }: any = {}) => o;

export const getEditionOptions = (editions: SpecialEdition[]): Option[] => {
  if (!editions) {
    return [];
  }

  const types = editions?.map(t => t?.type);
  return editionOptions.filter(o => types.includes(o.value));
};

export const getAudienceOptions = (audiences: Audience[]): Option[] => {
  if (!audiences) {
    return [];
  }

  return audiences.map(audience => {
    const option = audienceOptions.find(option => option.value === audience.title);
    return {
      label: option?.label || '',
      value: audience.id,
    };
  });
};

export const getSubjectsOptions = (subjects?: Subject[]): Option[] => {
  return (
    subjects?.map(subject => ({
      label: subject?.title,
      value: subject?.id,
    })) || []
  );
};
