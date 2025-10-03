"use client"
import { useEffect } from "react";
import OneSignal from "react-onesignal";



export default function NotificationInitializer() {
    useEffect(() => {
        OneSignal.init({
            appId: "3c4c9131-ddcd-49ed-a0a0-5d10e18c1c6a",
            safari_web_id: "",
            notifyingButton: {
                enable: true
            }
    })
});
    return null;
}