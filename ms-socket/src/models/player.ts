export class Player {
  id: string;
  userToken: string;
  role: string;
  nickname: string;

  constructor(id: string, userToken: string, role: string, nickname: string) {
    this.id = id;
    this.userToken = userToken;
    this.role = role;
    this.nickname = nickname;
  }

  // Diğer oyuncu işlevleri buraya eklenebilir
}
