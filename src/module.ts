export default async function module() {
  const param = { message: 'It works!' };
  console.log({ ...param }.message);
}
