import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputProps,
  Text,
  VStack,
  FlexboxProps,
  BorderProps,
  LayoutProps,
  TypographyProps,
  BoxProps,
} from '@chakra-ui/react';
import { forwardRef, useState, useEffect } from 'react';

interface FileUploaderProps
  extends Pick<InputProps, 'multiple'>,
    Pick<React.DOMAttributes<HTMLFormElement>, 'onChange'>,
    Omit<
      BoxProps,
      | 'height'
      | 'width'
      | 'textAlign'
      | 'borderWidth'
      | 'borderRadius'
      | 'borderStyle'
      | 'onChange'
    > {
  accept?: string;
  text?: string;
  buttonText?: string;
  errorMessage?: string;
  totalFiles: number;
  /**
   * Height of the component.
   * @default 15rem
   */
  height?: LayoutProps['height'];
  /**
   * Width of the component.
   * @default md
   */
  width?: LayoutProps['width'];
  /**
   * Text alignment of the component.
   * @default center
   */
  textAlign?: TypographyProps['textAlign'];
  /**
   * Border width of the component.
   * @default 2px
   */
  borderWidth?: BorderProps['borderWidth'];
  /**
   * Border radius of the component.
   * @default md
   */
  borderRadius?: BorderProps['borderRadius'];
  /**
   * Border style of the component.
   * @default dashed
   */
  borderStyle?: BorderProps['borderStyle'];
  /**
   * Gap between text and button.
   * @default 3
   */
  gap?: FlexboxProps['gap'];
  handleFiles: (files: FileList) => void;
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  (
    {
      accept,
      handleFiles,
      borderRadius = 'md',
      borderStyle,
      borderWidth = '2px',
      buttonText,
      errorMessage,
      gap = '3',
      height = '15rem',
      multiple = false,
      onChange,
      text,
      textAlign = 'center',
      totalFiles,
      width = 'md',
      ...rest
    },
    ref
  ) => {
    const [errorMsg, setErrorMsg] = useState(errorMessage ? errorMessage : '');
    const [drag, setDrag] = useState(false);

    const handleDrag = <T,>(e: React.DragEvent<T>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'dragover' || e.type === 'dragenter') {
        setDrag(true);
      } else if (e.type === 'dragleave' || e.type === 'drop') {
        setDrag(false);
      }
    };

    const handleDrop = <T,>(e: React.DragEvent<T>) => {
      const { files } = e.dataTransfer;

      e.preventDefault();
      e.stopPropagation();
      setDrag(false);

      if (files && files[0]) {
        handleFiles(files);

        if (files.length === totalFiles) {
          onChange?.(e as any);
        } else {
          setErrorMsg(`Please upload ${totalFiles} files`);
        }
      }
    };

    const onButtonClick = () => {
      try {
        const { current } = ref as React.RefObject<HTMLInputElement>;

        if (current) {
          current.click();
        }
      } catch (error) {
        setErrorMsg('The prop ref is not set');
      }
    };

    useEffect(() => {
      const updateErrorMsg = () => {
        if (ref) setErrorMsg('');
      };

      updateErrorMsg();
    }, [ref]);

    return (
      <Box
        height={height}
        width={width}
        textAlign={textAlign}
        borderWidth={borderWidth}
        borderRadius={borderRadius}
        borderStyle={borderStyle}
        position='relative'
        display='flex'
        justifyContent='center'
        alignItems='center'
        {...rest}
      >
        <form
          onDragEnter={handleDrag}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onChange={onChange}
        >
          <FormControl>
            <FormLabel>
              <VStack gap={gap}>
                <Text>{text ? text : 'Drag and drop your files here'}</Text>
                {errorMsg && <Text color='red.500'>{errorMsg}</Text>}
                <Button onClick={onButtonClick}>
                  {multiple && !buttonText
                    ? 'Upload files'
                    : buttonText
                    ? buttonText
                    : 'Upload file'}
                </Button>
              </VStack>
            </FormLabel>
            <Input
              type='file'
              multiple={multiple}
              display='none'
              ref={ref}
              accept={accept}
            />
          </FormControl>
          {drag && (
            <Box
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              position='absolute'
              width='100%'
              height='100%'
              top='0'
              left='0'
              borderRadius='md'
            />
          )}
        </form>
      </Box>
    );
  }
);
