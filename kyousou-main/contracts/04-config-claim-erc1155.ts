import sdk from "./01-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getContract("0x4F95195A4755a6ddD37E9F002F1a0917B264810E", "edition-drop");

(async () => {
  try {
    // オブジェクトの配列を渡すことで、条件を設定
    const claimConditions = [
      {
        startTime: new Date(),
        maxQuantity: 100_000,
        price: 0,
        quantityLimitPerTransaction: 1,
        waitInSeconds: MaxUint256,
      },
    ];
    await (await editionDrop).claimConditions.set("0", claimConditions);
    console.log("✅ Successfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();