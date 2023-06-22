/* eslint-disable prettier/prettier */
import { toast } from "react-toastify";

export function toastErrorTransaction(message: string) {
    let msg;
    if (message && message.length > 25)
        msg = message.substr(0, 25);
    else
        msg = "";

    switch (msg) {
        case "user rejected transaction":
            toast.error('Rejected transaction', {
                position: toast.POSITION.TOP_CENTER
            });
            break;
        default: 
            toast.error('Something went wrong, please try again later.', {
                position: toast.POSITION.TOP_CENTER
            });
    }
};

export function toastErrorSubmit(featureName: string | null = null) {
    let message = `An error occurred while submitting data 
                ${featureName ? `for ${featureName} feature` : ''}`;
    toast.error(message, {
        position: toast.POSITION.TOP_CENTER
    });
};

export function toastRevoke(events: any) {
    const length = events.length ? events.length : 0;
    const isSuccess = events
      ? events[length - 1].args?.isSuccess 
      : null;

    if (isSuccess === true) {
      toast.success("Revoke lent out book successfully");
    } else {
      toast.error(
        "You are not allowed to revoke the book when it hasn't expired yet."
      );
    }
};