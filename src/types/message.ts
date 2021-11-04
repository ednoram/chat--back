interface IMessage {
  _id?: string;
  text: string;
  roomId: string;
  createdAt: Date;
  username: string;
}

export default IMessage;
