export class GameUtils {
  static maptoMatchRatio(map) {
    let totalEntries = 0;
    let matchedEntries = 0;

    console.log(map);

    // Harita içindeki her anahtarı ve değeri döngüyle kontrol et
    for (let [_, innerMap] of map) {
      for (let [_, value] of innerMap) {
        totalEntries++;
        if (value === "YES") {
          matchedEntries++;
        }
      }
    }

    // Eşleşme yüzdesini hesapla
    const matchPercentage = (matchedEntries / totalEntries) * 100;

    console.log({ matchPercentage });
    return matchPercentage.toFixed(2);
  }
}
