import {FC} from "react";
import {Button} from "primereact/button";
import AppExtensionsSDK, {Command, View} from "@pipedrive/app-extensions-sdk";

const Result: FC<{
  job: string
  sdk: AppExtensionsSDK
}> = ({job, sdk}) => {
  const click = async () => {
    await sdk.execute(Command.REDIRECT_TO, {view: View.DEALS, id: job});
    await sdk.execute(Command.CLOSE_MODAL);
  }

  return <div className="result">
    <div className="title">Job created/updated</div>
    <Button label={`Job: ${job}`} severity="success" rounded onClick={click}/>
  </div>
}

export default Result;