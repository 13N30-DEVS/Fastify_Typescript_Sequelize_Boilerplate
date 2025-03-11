import * as Excel from "exceljs";
import * as async from "async";

interface WorkbookOptions {
  filename: string;
  useStyles: boolean;
  useSharedStrings: boolean;
}

interface BatchWriterParams {
  WorkSheet: Excel.Worksheet;
  headers: string[];
  controller: (params: any, skip: number, limit: number) => Promise<any[]>;
  params: any;
  totalRows: number;
  batchSize: any;
}

/**
 * Reads the rows from an Excel file.
 *
 * @param {string} filePath - The path to the Excel file.
 * @param {string} sheetName - The name of the sheet to read. Default value is 'Sheet1'.
 * @return {Promise<any[]>} An array of objects representing each row in the sheet.
 */

async function readExcelRows(
  filePath: string,
  sheetName: string = "Sheet1"
): Promise<any[]> {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet: any = workbook.getWorksheet(sheetName);

  const headerRow = worksheet.getRow(1).values;

  const rows: any[] = [];
  worksheet.eachRow(
    { includeEmpty: false, skip: 1 },
    (row: any, rowNumber: any) => {
      const rowValues = row.values;
      const rowData: any = {};
      headerRow.forEach((header: any, columnIndex: any) => {
        rowData[header] = rowValues[columnIndex];
      });
      rows.push(rowData);
    }
  );

  return rows;
}

/**
 * Creates an Excel workbook at the specified location with the given sheet name.
 *
 * @param {string} location - The file path and name where the Excel workbook should be created.
 * @param {string} sheetName - The name of the sheet within the workbook.
 * @return {Promise<{ WorkBook: Excel.stream.xlsx.WorkbookWriter }>} A promise that resolves to an object containing the created workbook.
 */
const makeExcel = (
  location: string,
  sheetName: string
): Promise<{ WorkBook: Excel.stream.xlsx.WorkbookWriter }> => {
  return new Promise((resolve, reject) => {
    try {
      const options: WorkbookOptions = {
        filename: location,
        useStyles: true,
        useSharedStrings: true,
      };

      const WorkBook = new Excel.stream.xlsx.WorkbookWriter(options);

      console.log("File has been created successfully!");

      resolve({ WorkBook });
    } catch (error) {
      reject({
        status: false,
        message: error,
      });
    }
  });
};

/**

Adds a new sheet to the Excel workbook.
@param {Excel.stream.xlsx.WorkbookWriter} WorkBook - The workbook to which the sheet should be added.
@param {string} sheetName - The name of the new sheet.
@return {Excel.Worksheet} The added worksheet object. */
const addSheet = (
  WorkBook: Excel.stream.xlsx.WorkbookWriter,
  sheetName: string
): Excel.Worksheet => WorkBook.addWorksheet(sheetName);

/**
 * Writes the header row in the given Excel worksheet.
 *
 * @param {Excel.Worksheet} workSheet - The worksheet to write the header row in.
 * @param {string[]} headers - An array of header names.
 * @return {void} This function does not return anything.
 */
const writeHeader = (workSheet: Excel.Worksheet, headers: string[]): void => {
  try {
    if (headers.length > 0) {
      const cols = headers.map((item) => ({
        header: item,
        key: item,
        width: 33,
        font: { bold: true },
      }));

      workSheet.columns = cols;

      workSheet.getRow(1).font = { bold: true };
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Writes rows to a worksheet in an Excel workbook.
 *
 * @param {Excel.Worksheet} workSheet - The worksheet to write the rows to.
 * @param {any[] | object} data - The data to be written as rows. It can be an array of objects or a single object.
 * @return {Promise<void>} A promise that resolves when the rows are successfully written, or rejects with an error if there was a problem.
 */
const WriteRows = (
  workSheet: Excel.Worksheet,
  data: any[] | object
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (Array.isArray(data) && data.length > 0) {
        async.each(
          data,
          (row: any, callback) => {
            workSheet.addRow(row).commit();
            callback();
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      } else {
        workSheet.addRow(data).commit();
        resolve();
      }
    } catch (err) {
      reject(err);
      console.log(err);
    }
  });
};

/**
 * Commits the changes made to the Excel workbook.
 *
 * @param {Excel.stream.xlsx.WorkbookWriter} workbook - The Excel workbook to commit.
 * @return {Promise<void>} A promise that resolves when the commit is successful, or rejects with an error if there was an issue.
 */
const commitExcel = (
  workbook: Excel.stream.xlsx.WorkbookWriter
): Promise<void> => {
  return new Promise((resolve, reject) => {
    workbook.commit().then(resolve).catch(reject);
  });
};

/**
 * Writes headers and rows to a given Excel worksheet.
 *
 * @param {Excel.Worksheet} WorkSheet - The worksheet to write to.
 * @param {string[]} headers - An array of header strings.
 * @param {any[] | object} data - An array of rows or an object representing a single row.
 * @return {Promise<Excel.Worksheet>} - The updated worksheet.
 */
const SheetWriter = async (
  WorkSheet: Excel.Worksheet,
  headers: string[],
  data: any[] | object
): Promise<Excel.Worksheet> => {
  writeHeader(WorkSheet, headers);
  await WriteRows(WorkSheet, data);
  return WorkSheet;
};

/**
 * Executes a batch operation to write data to a worksheet in batches.
 *
 * @param {BatchWriterParams} params - The parameters for the batch writer.
 * @param {WorkSheet} params.WorkSheet - The worksheet to write data to.
 * @param {string[]} params.headers - The headers for the data.
 * @param {Function} params.controller - The controller function to retrieve the data.
 * @param {any} params.controllerParams - The parameters for the controller function.
 * @param {number} params.totalRows - The total number of rows to write.
 * @param {string} params.batchSize - The batch size for writing data.
 * @return {Promise<void>} A promise that resolves when the batch operation is complete.
 */
const BatchWriter = async (params: BatchWriterParams): Promise<void> => {
  try {
    const {
      WorkSheet,
      headers,
      controller,
      params: controllerParams,
      totalRows,
      batchSize,
    } = params;
    const row_limit = Math.ceil(totalRows / parseInt(batchSize) || 1);
    const limit = parseInt(batchSize);
    writeHeader(WorkSheet, headers);

    for (let i = 0; i < row_limit; i++) {
      const skip = i * limit;
      const feedDataResult = await controller(controllerParams, skip, limit);
      await WriteRows(WorkSheet, feedDataResult);
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Maps the keys of a given struct object to an array of objects containing the header and key.
 *
 * @param {Record<string, string>} struct - The struct object to map the keys from.
 * @return {{ header: string; key: string }[]} - An array of objects containing the header and key.
 */
const keyMapper = (
  struct: Record<string, string>
): { header: string; key: string }[] => {
  let result: { header: string; key: string }[] = [];

  for (const key in struct) {
    result.push({
      header: struct[key],
      key,
    });
  }

  return result;
};

export default {
  makeExcel,
  writeHeader,
  WriteRows,
  commitExcel,
  keyMapper,
  addSheet,
  SheetWriter,
  BatchWriter,
  readExcelRows,
};
