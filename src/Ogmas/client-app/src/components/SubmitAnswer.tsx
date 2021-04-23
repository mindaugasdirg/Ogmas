import QrReader from "react-qr-reader";
import { TypedError } from "../types/types";

interface Props {
  submit: (answer: string) => Promise<void>;
  onError: (err: TypedError) => void;
}

export const SubmitAnswer = (props: Props) => {
  const onScan = (data: string | null) => {
    if(data){
      console.log("Scanned QR: ", data);
      props.submit(data);
    }
  };
  const onError = (err: Error) => props.onError(new TypedError("QrReaderError", err.message));

  return <QrReader onScan={onScan} onError={onError} />
};