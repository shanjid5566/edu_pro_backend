/**
 * Postman API helper for EduPro backend.
 *
 * Usage in Postman (Pre-request Script / Tests):
 * 1) Copy this file content into a Postman package or globals script.
 * 2) Use helpers to generate URLs and request payloads consistently.
 */

const jsonHeader = { key: "Content-Type", value: "application/json" };
const acceptHeader = { key: "Accept", value: "application/json" };

function readVar(key) {
  if (typeof pm !== "undefined") {
    const scopedValue =
      pm.variables.get(key) ||
      pm.environment.get(key) ||
      pm.collectionVariables.get(key) ||
      pm.globals.get(key);

    if (scopedValue !== undefined && scopedValue !== null && String(scopedValue).trim() !== "") {
      return String(scopedValue);
    }
  }

  return `{{${key}}}`;
}

function resolveBaseUrl() {
  return readVar("baseUrl");
}

function resolveToken() {
  return readVar("token");
}

function authHeaderFromToken(token) {
  return { key: "Authorization", value: `Bearer ${token}` };
}

function setToken(token, scope = "environment") {
  if (typeof pm === "undefined") return;
  if (scope === "collection") pm.collectionVariables.set("token", token);
  else if (scope === "global") pm.globals.set("token", token);
  else pm.environment.set("token", token);
}

function clearToken(scope = "environment") {
  if (typeof pm === "undefined") return;
  if (scope === "collection") pm.collectionVariables.unset("token");
  else if (scope === "global") pm.globals.unset("token");
  else pm.environment.unset("token");
}

function saveTokenFromLoginResponse(responseJson, scope = "environment") {
  const token =
    responseJson?.data?.token ||
    responseJson?.token ||
    responseJson?.accessToken ||
    "";

  if (token) setToken(token, scope);
  return token;
}

function cleanParams(params = {}) {
  const out = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

function buildQuery(params = {}) {
  const cleaned = cleanParams(params);
  const search = new URLSearchParams(cleaned).toString();
  return search ? `?${search}` : "";
}

function createRequest(method, path, options = {}) {
  const query = options.query ? buildQuery(options.query) : "";
  const authMode = options.authMode || "auto";
  const hasBody = options.body !== undefined;
  const tokenOverride = options.token;
  const token = tokenOverride || resolveToken();
  const shouldAttachAuth =
    authMode === "required" ||
    (authMode === "auto" && token && !/^\{\{.+\}\}$/.test(token));

  const headers = [acceptHeader];
  if (shouldAttachAuth) headers.push(authHeaderFromToken(token));
  if (hasBody) headers.push(jsonHeader);

  const request = {
    method,
    header: headers,
    url: `${resolveBaseUrl()}${path}${query}`,
  };

  if (hasBody) {
    request.body = {
      mode: "raw",
      raw: JSON.stringify(options.body, null, 2),
    };
  }

  return request;
}

const Api = {
  health: {
    status: () => createRequest("GET", "/health", { authMode: "none" }),
    ping: () => createRequest("GET", "/health/ping", { authMode: "none" }),
  },

  auth: {
    login: (email, password) =>
      createRequest("POST", "/auth/login", {
        authMode: "none",
        body: { email, password },
      }),
  },

  dashboard: {
    full: () => createRequest("GET", "/dashboard"),
    overview: () => createRequest("GET", "/dashboard/overview"),
    attendanceTrend: () => createRequest("GET", "/dashboard/attendance-trend"),
    performance: () => createRequest("GET", "/dashboard/performance"),
    todaysAttendance: () => createRequest("GET", "/dashboard/todays-attendance"),
    recentActivity: (limit) => createRequest("GET", "/dashboard/recent-activity", { query: { limit } }),
    classStatistics: (page, pageSize) =>
      createRequest("GET", "/dashboard/class-statistics", { query: { page, pageSize } }),
    teacherPerformance: (page, pageSize) =>
      createRequest("GET", "/dashboard/teacher-performance", { query: { page, pageSize } }),
    studentPerformance: (page, pageSize, classId) =>
      createRequest("GET", "/dashboard/student-performance", { query: { page, pageSize, classId } }),
    feeCollection: () => createRequest("GET", "/dashboard/fee-collection"),
    examSummary: () => createRequest("GET", "/dashboard/exam-summary"),
  },

  students: {
    list: ({ page, pageSize, search, classId, className, class: classAlias, section, status } = {}) =>
      createRequest("GET", "/students", {
        query: { page, pageSize, search, classId, className, class: classAlias, section, status },
      }),
    byClass: (classId, page, pageSize) => createRequest("GET", `/students/class/${classId}`, { query: { page, pageSize } }),
    get: (id) => createRequest("GET", `/students/${id}`),
    stats: (id) => createRequest("GET", `/students/${id}/stats`),
    create: (payload) => createRequest("POST", "/students", { body: payload }),
    update: (id, payload) => createRequest("PUT", `/students/${id}`, { body: payload }),
    delete: (id) => createRequest("DELETE", `/students/${id}`),
    export: ({ search, classId, className, class: classAlias, section, status } = {}) =>
      createRequest("GET", "/students/export", {
        query: { search, classId, className, class: classAlias, section, status },
      }),
  },

  teachers: {
    list: ({ page, pageSize, search, department, status } = {}) =>
      createRequest("GET", "/teachers", { query: { page, pageSize, search, department, status } }),
    get: (id) => createRequest("GET", `/teachers/${id}`),
    stats: (id) => createRequest("GET", `/teachers/${id}/stats`),
    create: (payload) => createRequest("POST", "/teachers", { body: payload }),
    update: (id, payload) => createRequest("PUT", `/teachers/${id}`, { body: payload }),
    delete: (id) => createRequest("DELETE", `/teachers/${id}`),
    assignSubjects: (id, subjectIds) => createRequest("POST", `/teachers/${id}/assign-subjects`, { body: { subjectIds } }),
    assignClasses: (id, classIds) => createRequest("POST", `/teachers/${id}/assign-classes`, { body: { classIds } }),
    export: ({ search, department, status } = {}) =>
      createRequest("GET", "/teachers/export", { query: { search, department, status } }),
  },

  parents: {
    list: ({ page, pageSize, search, status, occupation } = {}) =>
      createRequest("GET", "/parents", { query: { page, pageSize, search, status, occupation } }),
    search: (query, page, pageSize) => createRequest("GET", `/parents/search/${encodeURIComponent(query)}`, { query: { page, pageSize } }),
    stats: () => createRequest("GET", "/parents/stats"),
    get: (id) => createRequest("GET", `/parents/${id}`),
    create: (payload) => createRequest("POST", "/parents", { body: payload }),
    bulkCreate: (parents) => createRequest("POST", "/parents/bulk", { body: { parents } }),
    update: (id, payload) => createRequest("PUT", `/parents/${id}`, { body: payload }),
    assignStudents: (id, studentIds) => createRequest("POST", `/parents/${id}/students`, { body: { studentIds } }),
    delete: (id) => createRequest("DELETE", `/parents/${id}`),
    export: ({ search, status, occupation } = {}) =>
      createRequest("GET", "/parents/export", { query: { search, status, occupation } }),
  },

  classes: {
    list: ({ page, pageSize, search } = {}) => createRequest("GET", "/classes", { query: { page, pageSize, search } }),
    search: (query, page, pageSize) => createRequest("GET", `/classes/search/${encodeURIComponent(query)}`, { query: { page, pageSize } }),
    stats: () => createRequest("GET", "/classes/stats"),
    get: (id) => createRequest("GET", `/classes/${id}`),
    studentCount: (id) => createRequest("GET", `/classes/${id}/students/count`),
    create: (payload) => createRequest("POST", "/classes", { body: payload }),
    bulkCreate: (classes) => createRequest("POST", "/classes/bulk", { body: { classes } }),
    update: (id, payload) => createRequest("PUT", `/classes/${id}`, { body: payload }),
    assignSubjects: (id, subjectIds) => createRequest("POST", `/classes/${id}/subjects`, { body: { subjectIds } }),
    delete: (id) => createRequest("DELETE", `/classes/${id}`),
  },

  exams: {
    list: ({ page, pageSize, status, classId, subjectId, type, search } = {}) =>
      createRequest("GET", "/exams", { query: { page, pageSize, status, classId, subjectId, type, search } }),
    search: (query, page, pageSize) => createRequest("GET", `/exams/search/${encodeURIComponent(query)}`, { query: { page, pageSize } }),
    stats: () => createRequest("GET", "/exams/stats"),
    get: (id) => createRequest("GET", `/exams/${id}`),
    withResults: (id) => createRequest("GET", `/exams/${id}/results`),
    create: (payload) => createRequest("POST", "/exams", { body: payload }),
    bulkCreate: (exams) => createRequest("POST", "/exams/bulk", { body: { exams } }),
    update: (id, payload) => createRequest("PUT", `/exams/${id}`, { body: payload }),
    delete: (id) => createRequest("DELETE", `/exams/${id}`),
    export: ({ status, classId, subjectId, type, search } = {}) =>
      createRequest("GET", "/exams/export", { query: { status, classId, subjectId, type, search } }),
  },

  attendance: {
    dailyStats: (date) => createRequest("GET", "/attendance/daily-stats", { query: { date } }),
    overview: (date) => createRequest("GET", "/attendance/overview", { query: { date } }),
    classWise: (date) => createRequest("GET", "/attendance/class-wise", { query: { date } }),
    list: ({ page, pageSize, classId, studentId, status, startDate, endDate } = {}) =>
      createRequest("GET", "/attendance", {
        query: { page, pageSize, classId, studentId, status, startDate, endDate },
      }),
    get: (id) => createRequest("GET", `/attendance/${id}`),
    studentReport: (studentId, startDate, endDate) =>
      createRequest("GET", `/attendance/student/${studentId}/report`, { query: { startDate, endDate } }),
    studentPercentage: (studentId, startDate, endDate) =>
      createRequest("GET", `/attendance/student/${studentId}/percentage`, { query: { startDate, endDate } }),
    mark: (payload) => createRequest("POST", "/attendance", { body: payload }),
    update: (id, payload) => createRequest("PUT", `/attendance/${id}`, { body: payload }),
    delete: (id) => createRequest("DELETE", `/attendance/${id}`),
    bulkMark: (payload) => createRequest("POST", "/attendance/bulk", { body: payload }),
    export: ({ classId, studentId, status, startDate, endDate, date } = {}) =>
      createRequest("GET", "/attendance/export", {
        query: { classId, studentId, status, startDate, endDate, date },
      }),
  },

  notices: {
    list: ({ page, pageSize, category, sortBy } = {}) =>
      createRequest("GET", "/notices", { authMode: "none", query: { page, pageSize, category, sortBy } }),
    pinned: (limit) => createRequest("GET", "/notices/pinned", { authMode: "none", query: { limit } }),
    byCategory: (category, page, pageSize) =>
      createRequest("GET", `/notices/category/${category}`, { authMode: "none", query: { page, pageSize } }),
    search: (q, page, pageSize) => createRequest("GET", "/notices/search", { authMode: "none", query: { q, page, pageSize } }),
    get: (id) => createRequest("GET", `/notices/${id}`, { authMode: "none" }),
    create: (payload) => createRequest("POST", "/notices", { body: payload }),
    update: (id, payload) => createRequest("PUT", `/notices/${id}`, { body: payload }),
    pin: (id, pinned) => createRequest("PUT", `/notices/${id}/pin`, { body: { pinned } }),
    delete: (id) => createRequest("DELETE", `/notices/${id}`),
  },

  settings: {
    generalGet: () => createRequest("GET", "/settings/general", { authMode: "none" }),
    generalUpdate: (payload) => createRequest("PUT", "/settings/general", { body: payload }),

    userPreferencesGet: () => createRequest("GET", "/settings/user/preferences"),
    userPreferencesUpdate: (payload) => createRequest("PUT", "/settings/user/preferences", { body: payload }),

    userProfileGet: () => createRequest("GET", "/settings/user/profile"),
    userProfileUpdate: (payload) => createRequest("PUT", "/settings/user/profile", { body: payload }),

    changePassword: (payload) => createRequest("POST", "/settings/user/change-password", { body: payload }),
    toggleTwoFactor: (enabled) => createRequest("PUT", "/settings/user/two-factor", { body: { enabled } }),

    notificationUpdate: (payload) => createRequest("PUT", "/settings/user/notifications", { body: payload }),
    appearanceUpdate: (payload) => createRequest("PUT", "/settings/user/appearance", { body: payload }),

    getByKey: (key) => createRequest("GET", `/settings/${key}`),
    bulkUpdate: (settings) => createRequest("PUT", "/settings/bulk", { body: { settings } }),
    healthCheck: () => createRequest("GET", "/settings/health/check"),
  },
};

if (typeof pm !== "undefined") {
  pm.globals.set("ApiHelperLoaded", "true");
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Api,
    createRequest,
    buildQuery,
    cleanParams,
    setToken,
    clearToken,
    saveTokenFromLoginResponse,
  };
}

/**
 * Example:
 * const requestConfig = Api.students.list({ page: 1, pageSize: 20, class: "Class 8", status: "active" });
 * pm.sendRequest(requestConfig, (err, res) => {
 *   if (err) console.error(err);
 *   else console.log(res.json());
 * });
 */
