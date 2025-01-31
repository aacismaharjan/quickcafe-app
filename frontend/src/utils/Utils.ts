export const handleLogout = () => {
  localStorage.clear();
};


export class RoleService {
  private static STORAGE_KEY = "user";

  private getRoles(): string[] {
    const userData = localStorage.getItem(RoleService.STORAGE_KEY);
    if(!userData) return [];
    return JSON.parse(userData).roles?.map((role: {name: string}) => role.name) || [];
  }

  hasRole(roleName: string):boolean {
    return this.getRoles().includes(roleName);
  }

  hasAnyRole(roleNames: string[]): boolean {
    return roleNames.some((roleName) => this.hasRole(roleName));
  }

  hasAllRoles(roleNames: string[]): boolean {
    return roleNames.every((roleName) => this.hasRole(roleName));
  }
}