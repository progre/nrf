export default async function module() {
    console.log("It works!");
    document.getElementsByTagName("main")[0].appendChild(document.createTextNode("It works!"));
}
