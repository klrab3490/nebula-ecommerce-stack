"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    UserPlus,
    Users,
    Crown,
    Shield,
    User,
    Mail,
    Activity,
    Ban,
    Check,
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

export type UserData = {
    uuid: string;
    name: string;
    email: string;
    username?: string;
    role: "admin" | "seller" | "customer" | "moderator";
    status: "active" | "inactive" | "suspended" | "pending";
    joinDate: string;
    lastLogin?: string | null;
    orderCount: number;
    totalSpent: number;
    avatar?: string;
    phone?: string;
    location?: string;
};

export default function SellerCustomersClient({ users }: { users: UserData[] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
            user.uuid.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: UserData["role"]) => {
        const roleConfig = {
            admin: {
                variant: "default" as const,
                color: "bg-red-100 text-red-800 hover:bg-red-100",
                icon: Crown,
            },
            seller: {
                variant: "default" as const,
                color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
                icon: Shield,
            },
            moderator: {
                variant: "default" as const,
                color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
                icon: Shield,
            },
            customer: {
                variant: "secondary" as const,
                color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
                icon: User,
            },
        } as const;

        const config = roleConfig[role];
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className={`flex items-center gap-1 ${config.color}`}>
                <Icon className="h-3 w-3" />
                {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
        );
    };

    const getStatusBadge = (status: UserData["status"]) => {
        switch (status) {
            case "active":
                return (
                    <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 hover:bg-green-100"
                    >
                        Active
                    </Badge>
                );
            case "inactive":
                return <Badge variant="secondary">Inactive</Badge>;
            case "suspended":
                return <Badge variant="destructive">Suspended</Badge>;
            case "pending":
                return (
                    <Badge variant="outline" className="text-yellow-600">
                        Pending
                    </Badge>
                );
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const usersByRole = {
        all: users.length,
        admin: users.filter((u) => u.role === "admin").length,
        seller: users.filter((u) => u.role === "seller").length,
        moderator: users.filter((u) => u.role === "moderator").length,
        customer: users.filter((u) => u.role === "customer").length,
    };

    const usersByStatus = {
        all: users.length,
        active: users.filter((u) => u.status === "active").length,
        inactive: users.filter((u) => u.status === "inactive").length,
        suspended: users.filter((u) => u.status === "suspended").length,
        pending: users.filter((u) => u.status === "pending").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage users, roles, and permissions across the platform
                    </p>
                </div>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New User
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                                <p className="text-2xl font-bold">{usersByStatus.active}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Sellers</p>
                                <p className="text-2xl font-bold">{usersByRole.seller}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Customers</p>
                                <p className="text-2xl font-bold">{usersByRole.customer}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, email, username, or UUID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Role: {roleFilter === "all" ? "All" : roleFilter}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                                        All Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                                        Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setRoleFilter("seller")}>
                                        Seller
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setRoleFilter("moderator")}>
                                        Moderator
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setRoleFilter("customer")}>
                                        Customer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Status: {statusFilter === "all" ? "All" : statusFilter}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                                        All Status
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                                        Active
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                                        Inactive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>
                                        Suspended
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                                        Pending
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No users found</p>
                            <p className="text-muted-foreground">
                                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Users will appear here as they join the platform"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>UUID</TableHead>
                                    <TableHead>Email/Username</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Orders</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.uuid}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    {user.location && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {user.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-xs">
                                                {user.uuid.slice(0, 8)}...{user.uuid.slice(-8)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {user.email}
                                                </div>
                                                {user.username && (
                                                    <div className="text-xs text-muted-foreground">
                                                        @{user.username}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell className="text-center">
                                            {user.orderCount}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(user.totalSpent)}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(user.joinDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {user.lastLogin
                                                ? new Date(user.lastLogin).toLocaleDateString()
                                                : "Never"}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => setSelectedUser(user)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit User
                                                    </DropdownMenuItem>
                                                    {user.status === "suspended" ? (
                                                        <DropdownMenuItem>
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Unsuspend
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Ban className="h-4 w-4 mr-2" />
                                                            Suspend User
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>User Details - {selectedUser.name}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedUser(null)}
                                >
                                    ×
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Basic Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Full Name</p>
                                        <p className="font-medium">{selectedUser.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Username</p>
                                        <p className="font-medium">
                                            {selectedUser.username || "Not set"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">UUID</p>
                                        <p className="font-mono text-xs">{selectedUser.uuid}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Role</p>
                                        <div className="mt-1">
                                            {getRoleBadge(selectedUser.role)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Status</p>
                                        <div className="mt-1">
                                            {getStatusBadge(selectedUser.status)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Location</p>
                                        <p className="font-medium">
                                            {selectedUser.location || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Email Address</p>
                                        <p className="font-medium">{selectedUser.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Phone Number</p>
                                        <p className="font-medium">
                                            {selectedUser.phone || "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Activity & Statistics
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Join Date</p>
                                        <p className="font-medium">
                                            {new Date(selectedUser.joinDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Last Login</p>
                                        <p className="font-medium">
                                            {selectedUser.lastLogin
                                                ? new Date(selectedUser.lastLogin).toLocaleString()
                                                : "Never"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Total Orders</p>
                                        <p className="font-medium">{selectedUser.orderCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Total Spent</p>
                                        <p className="font-medium">
                                            {formatCurrency(selectedUser.totalSpent)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                                <Button variant="outline" className="flex-1">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit User
                                </Button>
                                {selectedUser.status === "suspended" ? (
                                    <Button variant="default" className="flex-1">
                                        <Check className="h-4 w-4 mr-2" />
                                        Unsuspend User
                                    </Button>
                                ) : (
                                    <Button variant="destructive" className="flex-1">
                                        <Ban className="h-4 w-4 mr-2" />
                                        Suspend User
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
