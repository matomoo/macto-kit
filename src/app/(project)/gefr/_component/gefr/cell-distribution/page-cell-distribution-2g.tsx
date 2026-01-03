// biome-ignore assist/source/organizeImports: <will fix later>
import CellDist2gTchBlock from "./cell-dist-2g-tch-block";
import CellDist2gPdtchBlock from "./cell-dist-2g-pdtch-block";
import CellDist2gSdBlock from "./cell-dist-2g-sd-block";
import CellDist2gHosr from "./cell-dist-2g-hosr";
import CellDist2gTchDrop from "./cell-dist-2g-tch-drop";
import CellDist2gSdsr from "./cell-dist-2g-sdsr";

const PageCellDistribution2g = ({ level }: { level: string }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <CellDist2gSdBlock title={"SD Block"} level={level} />
        <CellDist2gTchBlock title={"TCH Block"} level={level} />
        <CellDist2gPdtchBlock title={"PDTCH Congestion"} level={level} />
        <CellDist2gTchDrop title={"TCH Drop"} level={level} />
        <CellDist2gSdsr title={"SDSR"} level={level} />
        <CellDist2gHosr title={"HOSR"} level={level} />
      </div>
    </div>
  );
};

export default PageCellDistribution2g;
