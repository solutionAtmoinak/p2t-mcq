export interface IPackage {
    PackageId?: number;
    PackageName?: string;
    LastUpdatedOn?: string;
    IsActive?: boolean;
    IsDeleted?: boolean;
    IsBlocked?: boolean;
    CourseId?: number;
    CourseName?: string;
    IsDirectPlay?: boolean;
    PackageExpiryDate?: string;
    IsShow?: number;
    IsFree?: boolean;
    isActivateByUser?: number;
    isPause?: number;
    isTotal?: number;
    isViewCounter?: number;
    pausedays?: number;
}
