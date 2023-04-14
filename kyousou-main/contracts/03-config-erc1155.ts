import sdk from "./01-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getContract("0x4F95195A4755a6ddD37E9F002F1a0917B264810E", "edition-drop");

(async () => {
  try {
    await (await editionDrop).createBatch([
      {
        name: "Member's Limited Card",
        description: "Kousouにおけるメンバーシップ権です",
        image: readFileSync("contracts/assets/image/kotatsu.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();