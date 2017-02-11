export default async function module() {
    let param = { message: "It works!" };
    console.log({ ...param }.message);
}
