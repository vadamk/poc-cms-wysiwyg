import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import { gql } from 'apollo-boost';

import { SummaryFragment } from 'core/graphql/fragments';
import { Summary } from 'core/models/generated';
import RichEditor from 'components/RichEditor';

import sty from './ContentEditor.module.scss';
import { useMutation } from '@apollo/react-hooks';
import { GET_GUIDE } from 'components/UpdateGuide';
import { removeTypeName } from 'core/utils';

export const UPDATE_SUMMARY = gql`
  mutation UpdateSummary($summary: UpdateSummaryInput!) {
    updateSummary(summary: $summary) {
      ...SummaryFragment
    }
  }
  ${SummaryFragment}
`;

export interface ContentEditorProps {
  summary: Summary;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ summary }) => {
  const { slug } = useParams();

  const [content, setContent] = React.useState(summary?.content || '');

  const discoveryId = React.useMemo(() => Number(slug), [slug]);

  React.useEffect(() => {
    setContent(summary?.content);
  }, [summary])

  const [updateSummary, updateSummaryStatus] = useMutation(UPDATE_SUMMARY, {
    refetchQueries: [{ query: GET_GUIDE, variables: { discoveryId } }],
    onCompleted: ({ updateSummary: { content } }) => {
      message.success('Step has been updated.');

      if (summary) {
        summary.content = content;
      }
    }
  });

  const saveChanges = React.useCallback(() => {
    updateSummary({
      variables: {
        summary: { ...removeTypeName(summary), content }
      }
    });
  }, [content, summary, updateSummary]);

  return (
    <>
      <Button
        type="primary"
        disabled={content === '' || content === summary.content}
        loading={updateSummaryStatus.loading}
        onClick={saveChanges}
      >
        Save changes
      </Button>
      <RichEditor value={content || summary.content} onChange={setContent} />
    </>
  );
};

export default ContentEditor;
