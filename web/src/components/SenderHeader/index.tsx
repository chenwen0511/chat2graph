import { useKnowledgebaseEntity } from '@/domains/entities/knowledgebase-manager';
import useIntlConfig from '@/hooks/useIntlConfig';
import { Attachments, Sender } from '@ant-design/x';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { GetProp, message, UploadFile } from 'antd/lib';
import { Upload } from 'antd';
import React from 'react';
import styles from './index.less';

interface Props {
  open: boolean;
  attachedFiles?: GetProp<typeof Attachments, 'items'>;
  onOpenChange: (open: boolean) => void;
  handleFileChange: (info: UploadChangeParam<UploadFile<any>>) => void;
  onAddUploadId: (fileId: { file_id: string, uid: string }) => void
};

const SenderHeader: React.FC<Props> = (props) => {
  const { open, attachedFiles, onOpenChange, handleFileChange, onAddUploadId, } = props;
  const { runUploadFile } = useKnowledgebaseEntity()
  const { formatMessage } = useIntlConfig();



  const beforeUpload = async (file: RcFile) => {
    const { type, size, name } = file
    const fileBlob = new Blob([file], { type })
    if (size > 20 * 1024 * 1024) {
      message.error(formatMessage('knowledgebase.detail.upload.errorSize'))
      return false
    }
    const res = await runUploadFile({
      file: fileBlob,
      filename: name
    })
    if (!res?.success) {
      message.error(res?.message)
      return Upload.LIST_IGNORE
    }

    onAddUploadId({
      file_id: res?.data?.file_id || '',
      uid: file.uid
    })

    return false
  }




  return <div className={styles['sender-header']}>
    <Sender.Header
      title={<>
        <i className={`iconfont  icon-Chat2graphwenjianshangchuanbiaoshi ${styles['icon-file']}`} />
        {formatMessage('home.attachment')}
      </>}
      open={open}
      onOpenChange={onOpenChange}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={beforeUpload}
        name='file'
        accept='.pdf,.xlsx,.doc,.docx,.md,.txt'
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === 'drop'
            ? { title: 'Drop file here' }
            : {
              icon: <i className='iconfont icon-Chat2graphtuofangwenjian' style={{ fontSize: 30, color: '#98989d' }} />,
              title: formatMessage('knowledgebase.detail.upload.title'),
              description: formatMessage('knowledgebase.detail.upload.description'),

            }
        }
      />
    </Sender.Header>
  </div>
};

export default SenderHeader