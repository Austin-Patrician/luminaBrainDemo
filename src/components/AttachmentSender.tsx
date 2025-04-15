import { CloudUploadOutlined, LinkOutlined } from '@ant-design/icons';
import { Attachments, AttachmentsProps, Sender } from '@ant-design/x';
import { Button, Flex, type GetProp, type GetRef } from 'antd';
import React from 'react';
import { CSSProperties } from 'react';

interface AttachmentSenderProps {
    onSubmit?: (text: string, files: GetProp<AttachmentsProps, 'items'>) => void;
    style?: CSSProperties | undefined;
}

const AttachmentSender: React.FC<AttachmentSenderProps> = ({
    onSubmit,
    style,
}) => {
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState<GetProp<AttachmentsProps, 'items'>>([]);
    const [text, setText] = React.useState('');

    const attachmentsRef = React.useRef<GetRef<typeof Attachments>>(null);
    const senderRef = React.useRef<GetRef<typeof Sender>>(null);

    const senderHeader = (
        <Sender.Header
            title="Attachments"
            styles={{
                content: {
                    padding: 0,
                },
            }}
            open={open}
            onOpenChange={setOpen}
            forceRender
        >
            <Attachments
                ref={attachmentsRef}
                // Mock not real upload file
                beforeUpload={() => false}
                items={items}
                onChange={({ fileList }) => setItems(fileList)}
                placeholder={(type) =>
                    type === 'drop'
                        ? {
                            title: 'Drop file here',
                        }
                        : {
                            icon: <CloudUploadOutlined />,
                            title: 'Upload files',
                            description: 'Click or drag files to this area to upload',
                        }
                }
                getDropContainer={() => senderRef.current?.nativeElement}
            />
        </Sender.Header>
    );

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(text, items);
        }
        setItems([]);
        setText('');
    };

    return (
        <Flex style={style} align="end">
            <Sender
                ref={senderRef}
                header={senderHeader}
                prefix={
                    <Button
                        type="text"
                        icon={<LinkOutlined />}
                        onClick={() => {
                            setOpen(!open);
                        }}
                    />
                }
                value={text}
                onChange={setText}
                onPasteFile={(_, files) => {
                    for (const file of files) {
                        attachmentsRef.current?.upload(file);
                    }
                    setOpen(true);
                }}
                onSubmit={handleSubmit} />
        </Flex>
    );
};

export default AttachmentSender;