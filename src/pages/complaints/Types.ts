
export type ComplaintStatus = "InProgress" | "Completed" | string;

export interface Complaint {
    complaintId: string;
    followUpNumber: string;
    description: string;
    status: ComplaintStatus;
    creationDate: string;
    creationTime: string;
}

export interface ComplaintsListResult {
    items: Complaint[];
    total: number;
    pageIndex: number;
    pageSize: number;
    pages: number;
    isFilterActive: boolean;
}

export interface ApiResponse<T> {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors: string[];
    result: T;
}

export interface CreateComplaintRequest {
    followUpNumber: string;
    description: string;
}

export interface ComplaintEligibilityResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors: string[];
    result: boolean;
}

export interface CreateComplaintResponse {
    succeeded: boolean;
    messageEn: string | null;
    messageAr: string | null;
    errors: string[];
    result: {
        reason: string | null;
        field: string | null;
    } | null;
}

export interface ComplaintsFilterParams {
    Search?: string;
    Status?: number;
    DateFrom?: string;
    DateTo?: string;
    PageIndex: number;
    PageSize: number;
}
