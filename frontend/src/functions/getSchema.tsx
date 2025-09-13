import * as dfd from "danfojs";

interface SchemaResult {
  columns: string[];
  shape: number[];
  dtypes: any[];
  describe: any[];
}

const getSchema = async (file: File): Promise<SchemaResult | void> => {
  try {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let df: any;

    if (ext === "csv") {
      df = await dfd.readCSV(file);
    } else if (ext === "xlsx" || ext === "xls") {
      df = await dfd.readExcel(file);
    } else {
      throw new Error("Unsupported file type");
    }

    // Extract metadata
    const columns = df.columns;
    const shape = df.shape;
    console.log("df.ctypes:", df.ctypes);
    console.log("df.describe():", df.describe());
    // Convert ctypes DataFrame → JSON
    const dtypes = dfd.toJSON(df.ctypes, { format: "row" });

    // Convert describe DataFrame → JSON
    const describe = dfd.toJSON(df.describe(), { format: "row" });

    return { columns, shape, dtypes, describe };
  } catch (error) {
    console.error("Error processing file:", error);
    return;
  }
};

export default getSchema;
