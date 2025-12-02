import { RequestInfo } from "angular-in-memory-web-api";
import { InjuryItem } from "./injury.model";

export class InjuryReasonController {

  // ---------------------------
  // GET ALL
  // ---------------------------
  static getAll(reqInfo: RequestInfo) {
    try {
      let items = reqInfo.collection as InjuryItem[];

      // Optional searchTerm
      const searchTerm = (reqInfo.query.get("searchTerm")?.[0] ?? "")
        .trim()
        .toLowerCase();

      if (searchTerm !== "") {
        items = items.filter(i =>
          i.name.toLowerCase().includes(searchTerm)
        );
      }

      if (items.length === 0) {
        return this.notFound(reqInfo, "لا يوجد أسباب إصابة متاحة.");
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: items,
      }));

    } catch {
      return this.serverError(reqInfo, "Failed to load injury reasons.");
    }
  }

  // ---------------------------
  // GET BY ID
  // ---------------------------
  static getById(reqInfo: RequestInfo) {
    try {
      const id = Number(reqInfo.id);
      const items = reqInfo.collection as InjuryItem[];

      const item = items.find(i => i.id === id);

      if (!item) {
        return this.notFound(reqInfo, "Injury reason not found.");
      }

      return reqInfo.utils.createResponse$(() => ({
        status: 200,
        body: item,
      }));

    } catch {
      return this.serverError(reqInfo, "Failed to load injury reason.");
    }
  }

  // ---------------------------
  // ERROR HELPERS
  // ---------------------------
  private static notFound(reqInfo: RequestInfo, message: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 404,
      error: {
        type: "not-found",
        title: "Resource not found",
        status: 404,
        detail: message,
      },
    }));
  }

  private static serverError(reqInfo: RequestInfo, detail: string) {
    return reqInfo.utils.createResponse$(() => ({
      status: 500,
      error: {
        type: "server-error",
        title: "Server Error",
        status: 500,
        detail,
      },
    }));
  }
}
