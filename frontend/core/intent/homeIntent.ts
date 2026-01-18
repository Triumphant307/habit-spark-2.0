import { appState } from "../state/state";

export const trackHomeVisit = (): boolean => {
  const hasVisited = appState.user.visitedHome

  if(!hasVisited) {
    console.log("First time home visit")
    appState.set("user.visitedHome", true)
    return false
  }

  else {
    console.log("Welcome back!")
    return true
  
  }
}