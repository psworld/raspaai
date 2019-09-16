import client from "./src/components/apollo/client"
export { wrapRootElement } from "./src/components/apollo/wrap-root-element"

export const onClientEntry = () => {
  client.writeData({
    data: { localSavedLocation: localStorage.getItem("lla") },
  })

  // return <Viewer></Viewer>
}
