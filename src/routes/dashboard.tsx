import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect, Fragment } from "react";
import {
  Building2,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  MapPin,
  Clock,
  Plus,
  HelpCircle,
  Activity,
  Trash2,
  Check,
  Edit2,
  Dumbbell,
  Image as ImageIcon,
  FileText,
  Eye,
  X,
  ShieldAlert,
  DoorOpen,
  MessageCircle,
  Star,
  Flag,
  MoreHorizontal,
  Wrench,
  Zap,
  Snowflake,
  DollarSign,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  BarChart2,
  Navigation,
  Scan,
  ShoppingCart,
  Package,
  PackagePlus,
  PlusCircle,
  Upload,
  QrCode,
  Printer,
  Filter,
  MoreVertical,
  Slash,
  UserCheck,
  UserX,
  Layers,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard")({
  component: GymDashboard,
});

// Full Dashboard Code
