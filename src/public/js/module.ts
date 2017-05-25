import { remote } from 'electron';

export default async function module() {
  console.log('It works!', remote.require('electron').app.getVersion());
}
