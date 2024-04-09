// Socket.IO ile bağlantı kur
var socket = io('http://localhost:3000');

function oyunOlustur() {
    // Sunucuya 'createGame' olayını gönder
    socket.emit('createGame', {"gameId": 10, "userId": 1});

    // İsteğe bağlı olarak, kullanıcıya bilgi vermek için bir mesaj gösterebilirsiniz
    //alert('Oyun oluşturma isteği gönderildi!');
}

function oyunaKatil(kod) {
    if(kod.length === 6) {
        // Sunucuya 'joinGame' olayını ve katılma kodunu gönder
        socket.emit('joinGame', { gameCode: kod });
        alert('Oyuna katılma isteği gönderildi!');
    } else {
        alert('Lütfen geçerli bir 6 haneli kod girin.');
    }
}

function cevapOlustur(kod) {
    if(kod.length === 6) {
        // Sunucuya 'joinGame' olayını ve katılma kodunu gönder
        socket.emit('createAnswer', { gameCode: kod });
        alert('Cevap gönderildi!');
    } else {
        alert('Lütfen geçerli bir 6 haneli kod girin.');
    }
}

// Sunucudan gelen yanıtları dinleme (isteğe bağlı)
socket.on('gameCreated', function(data) {
    console.log(data)
    console.log('Oyun başarıyla oluşturuldu, oyun kodu:', data.gameCode);
});

// Sunucudan gelen yanıtları dinleme (isteğe bağlı)
socket.on('gameStarted', function(data) {
    console.log('Oyun başladı, ilk soru gelsin. oyun:', data);
});

// Sunucudan gelen yanıtları dinleme (isteğe bağlı)
socket.on('answerCreated', function(data) {
    console.log('Cevaplar kaydedildi, son durum:', data);
});

// Sunucudan gelen yanıtları dinleme (isteğe bağlı)
socket.on('questionAsked', function(data) {
    console.log('Soru:', data);
});

// İstemci tarafındaki JavaScript kodu
socket.on('gameEnded', function(results) {
    console.log('Oyun bitti, sonuçlar:', results);
});