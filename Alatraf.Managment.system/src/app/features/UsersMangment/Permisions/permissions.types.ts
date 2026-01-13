export type ExtraPermission = {
  label: string;
  perm: string;
};

export type PermissionGroup = {
  label: string;

  read?: string;
  create?: string;
  update?: string;
  delete?: string;

  print?: string;
  changeStatus?: string;

  extras?: ExtraPermission[];
};
