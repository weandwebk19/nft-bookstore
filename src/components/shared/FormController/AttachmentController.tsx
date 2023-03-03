import { Controller, useFormContext } from "react-hook-form";

import { UploadField } from "@/components/shared/UploadField";

type AttachmentControllerProps = {
  name: string;
  multiple?: any;
  desc?: string;
};

const AttachmentController = ({
  multiple = false,
  desc,
  ...rest
}: AttachmentControllerProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      {...rest}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { invalid, error }
      }) => (
        <>
          <UploadField
            onChange={onChange}
            onBlur={onBlur}
            helperText={invalid ? error?.message : ""}
            error={invalid}
            uploaded={value}
            multiple={multiple}
            desc={desc}
          />
        </>
      )}
      name={rest.name}
      control={control}
    />
  );
};

export default AttachmentController;
