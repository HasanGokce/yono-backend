export class Player {
    id: number;
    userToken: string;
    role: string;
    nickName: string;


    constructor(id: number, userToken: string, role:string, nickName: string) {
        this.id = id;
        this.userToken = userToken;
        this.role = role
        this.nickName = nickName;
    }

    // Diğer oyuncu işlevleri buraya eklenebilir
}