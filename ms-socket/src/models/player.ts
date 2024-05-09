export class Player {
    id: number;
    userToken: string;
    role: string;
    nickname: string;


    constructor(id: number, userToken: string, role:string, nickname: string) {
        this.id = id;
        this.userToken = userToken;
        this.role = role
        this.nickname = nickname;
    }

    // Diğer oyuncu işlevleri buraya eklenebilir
}