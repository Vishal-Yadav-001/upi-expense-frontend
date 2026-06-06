"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import {
  ListFilter,
  Search,
  RefreshCw,
  Loader2,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { NetworkStatus } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { GET_TRANSACTIONS_LEDGER, TransactionsLedgerData, TransactionRow } from "@/lib/queries";
import { CategoryDropdown } from "@/components/transactions/CategoryDropdown";
import { usePrivacy } from "@/context/PrivacyContext";
import { maskName } from "@/lib/privacy";
import { useSync } from "@/hooks/useSync";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function TransactionsContainer() {
  const [directionFilter, setDirectionFilter] = useState<"ALL" | "DEBIT" | "CREDIT">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);

  const { isPrivacyEnabled, hasHydrated } = usePrivacy();
  const { sync, isSyncing } = useSync();

  // Fetch ALL transactions once — no direction/limit variable.
  // Filtering, sorting, pagination all happen client-side via TanStack Table.
  const { data, error, refetch, networkStatus } = useQuery<TransactionsLedgerData>(
    GET_TRANSACTIONS_LEDGER,
    { notifyOnNetworkStatusChange: true }
  );

  // Only show loading spinner on first load (no data yet) or explicit manual refetch.
  // cache-and-network does a silent background refetch — don't spin for that.
  const isInitialLoading = networkStatus === NetworkStatus.loading;
  const isManualRefetching = networkStatus === NetworkStatus.refetch;

  const rawTransactions = data?.transactions || [];

  const getMaskedEntity = (name: string) => {
    if (isPrivacyEnabled && hasHydrated) return maskName(name);
    return name;
  };

  // Apply direction + search filters before handing to TanStack
  const filteredData = useMemo(() => {
    return rawTransactions.filter((tx) => {
      // Direction filter
      if (directionFilter !== "ALL" && tx.direction !== directionFilter) return false;
      // Text search — match payee displayName or category
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const nameMatch = tx.payee?.displayName?.toLowerCase().includes(term) ?? false;
        const catMatch = tx.payee?.category?.toLowerCase().includes(term) ?? false;
        if (!nameMatch && !catMatch) return false;
      }
      return true;
    });
  }, [rawTransactions, directionFilter, searchTerm]);

  // Totals for the filtered set (shown in summary bar)
  const totals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    for (const tx of filteredData) {
      if (tx.direction === "DEBIT") debit += tx.amount;
      else if (tx.direction === "CREDIT") credit += tx.amount;
    }
    return { debit, credit, count: filteredData.length };
  }, [filteredData]);

  const formatAmount = (amount: number, dir: string, compact = false) => {
    const abs = Math.abs(amount).toLocaleString("en-IN", {
      minimumFractionDigits: compact ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return (
      <span className={cn("font-mono font-bold", dir === "CREDIT" ? "text-teal" : "text-foreground")}>
        {dir === "CREDIT" ? "+" : "-"} ₹{abs}
      </span>
    );
  };

  // TanStack column definitions
  const columns = useMemo<ColumnDef<TransactionRow>[]>(
    () => [
      {
        id: "entity",
        accessorFn: (row) => row.payee?.displayName ?? "Unknown Payee",
        header: "Entity",
        enableSorting: true,
        cell: ({ row }) => {
          const tx = row.original;
          const name = tx.payee ? getMaskedEntity(tx.payee.displayName) : "Unknown Payee";
          return (
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg border shrink-0",
                tx.direction === "CREDIT"
                  ? "bg-teal-soft/10 border-teal/20 text-teal"
                  : "bg-white/5 border-white/5 text-foreground/40"
              )}>
                {tx.direction === "CREDIT" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
              </div>
              <span
                className="text-xs font-semibold text-foreground truncate block max-w-[180px]"
                title={name}
              >
                {name}
              </span>
            </div>
          );
        },
      },
      {
        id: "category",
        accessorFn: (row) => row.payee?.category ?? "UNCATEGORIZED",
        header: "Category",
        enableSorting: true,
        cell: ({ row }) => {
          const tx = row.original;
          return tx.payee?.id ? (
            <CategoryDropdown payeeId={tx.payee.id} currentCategory={tx.payee.category ?? "UNCATEGORIZED"} />
          ) : (
            <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-foreground/50">
              Uncategorized
            </span>
          );
        },
      },
      {
        id: "date",
        accessorFn: (row) => row.date,
        header: "Date",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-xs text-foreground/50 font-sans">
            {new Date(isNaN(Number(row.original.date)) ? row.original.date : Number(row.original.date))
              .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        ),
      },
      {
        id: "status",
        accessorFn: (row) => row.status,
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => (
          <span className={cn(
            "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
            row.original.status === "SUCCESS"
              ? "bg-teal-soft/10 border-teal/15 text-teal"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          )}>
            {row.original.status || "SUCCESS"}
          </span>
        ),
      },
      {
        id: "amount",
        accessorFn: (row) => row.amount,
        header: "Amount",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="text-right">
            {formatAmount(row.original.amount, row.original.direction)}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPrivacyEnabled, hasHydrated]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  const SortIcon = ({ id }: { id: string }) => {
    const sorted = sorting.find((s) => s.id === id);
    if (!sorted) return <ArrowUpDown size={12} className="text-foreground/20 ml-1 inline" />;
    return sorted.desc
      ? <ArrowDown size={12} className="text-accent ml-1 inline" />
      : <ArrowUp size={12} className="text-accent ml-1 inline" />;
  };

  const showSummary = searchTerm.trim() !== "" || directionFilter !== "ALL";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal/10 text-teal rounded-xl border border-teal/20">
            <ListFilter size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Transaction Ledger</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Detailed Audit Trail</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => refetch()}
            disabled={isManualRefetching}
            className="p-2 bg-white/5 border border-border hover:bg-white/10 text-foreground/60 hover:text-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Reload Transactions"
          >
            <RefreshCw size={16} className={cn(isManualRefetching && "animate-spin")} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={sync}
            disabled={isSyncing || !!error || !data || rawTransactions.length === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold uppercase tracking-wider cursor-pointer",
              isSyncing ? "bg-teal/20 border-teal/50 text-teal animate-pulse" : "bg-teal/10 border-teal/20 text-teal hover:bg-teal/20",
              (isSyncing || !!error || !data || rawTransactions.length === 0) && "opacity-40 cursor-not-allowed pointer-events-none border-teal/10"
            )}
          >
            {isSyncing
              ? <><Loader2 size={14} className="animate-spin" /><span>Syncing AI...</span></>
              : <><RefreshCw size={14} /><span>Sync AI</span></>}
          </motion.button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center p-10 bg-card/30 border border-border/50 rounded-2xl text-destructive/80 text-center space-y-4 max-w-lg mx-auto animate-in fade-in">
          <ShieldAlert size={44} strokeWidth={1.5} className="text-destructive animate-pulse" />
          <h3 className="font-heading font-bold text-base text-white">Transactions Ledger Halted</h3>
          <p className="text-xs text-foreground/60 leading-relaxed font-sans max-w-sm">{error.message}</p>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => refetch()}
            className="px-5 py-2.5 bg-destructive text-white hover:bg-red-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-destructive/15"
          >
            Try Again
          </motion.button>
        </div>
      ) : (
        <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} initial="hidden" animate="show" className="space-y-4">

          {/* Control Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center bg-card/40 border border-border/50 backdrop-blur-md p-4 rounded-2xl">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                placeholder="Search merchants or categories..."
                className="w-full bg-white/5 border border-border/80 focus:border-accent/40 rounded-xl pl-10 pr-4 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/20"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); table.setPageIndex(0); }}
              />
            </div>

            {/* Direction Filters */}
            <div className="flex items-center bg-panel/30 border border-border/50 p-1 rounded-xl justify-self-stretch lg:justify-self-center">
              {(["ALL", "DEBIT", "CREDIT"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => { setDirectionFilter(dir); table.setPageIndex(0); }}
                  className={cn(
                    "flex-1 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                    directionFilter === dir ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-foreground/40 hover:text-foreground/75"
                  )}
                >
                  {dir === "DEBIT" ? "Spent" : dir === "CREDIT" ? "Received" : "All"}
                </button>
              ))}
            </div>

            {/* Per-page selector */}
            <div className="flex items-center gap-3 justify-end justify-self-stretch lg:justify-self-end">
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Per page:</span>
              <select
                className="bg-white/5 border border-border/80 focus:border-accent/40 rounded-xl px-3 py-1.5 text-xs text-foreground font-bold outline-none cursor-pointer"
                value={table.getState().pagination.pageSize}
                onChange={(e) => { table.setPageSize(Number(e.target.value)); table.setPageIndex(0); }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size} className="bg-card text-foreground">{size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Bar — shown when search or filter is active */}
          {showSummary && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-4 px-5 py-3 bg-card/40 border border-border/50 backdrop-blur-md rounded-2xl text-xs"
            >
              <span className="text-foreground/40 font-bold uppercase tracking-widest">
                {totals.count} transaction{totals.count !== 1 ? "s" : ""}
              </span>
              {(directionFilter === "ALL" || directionFilter === "DEBIT") && totals.debit > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="text-foreground/30">Total Spent</span>
                  <span className="font-mono font-bold text-foreground">
                    ₹{totals.debit.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </span>
              )}
              {(directionFilter === "ALL" || directionFilter === "CREDIT") && totals.credit > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="text-foreground/30">Total Received</span>
                  <span className="font-mono font-bold text-teal">
                    ₹{totals.credit.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </span>
              )}
            </motion.div>
          )}

          {/* Table Container */}
          <div className="bg-card/40 border border-border/50 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col min-h-[400px] shadow-xl">
            {isInitialLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-foreground/40">
                <Loader2 size={36} className="animate-spin text-accent mb-4" />
                <p className="text-sm font-medium">Fetching secure transaction data...</p>
              </div>
            ) : table.getRowModel().rows.length > 0 ? (
              <>
                {/* Desktop Table */}
                <table className="w-full border-collapse table-fixed hidden md:table">
                  <thead>
                    <tr className="bg-panel/50 border-b border-border/30">
                      {table.getHeaderGroups()[0].headers.map((header) => (
                        <th
                          key={header.id}
                          className={cn(
                            "px-6 py-4 text-[10px] font-heading font-bold text-foreground/40 uppercase tracking-widest",
                            header.id === "amount" ? "text-right w-[15%]" : "text-left",
                            header.id === "entity" && "w-[35%]",
                            header.id === "category" && "w-[20%]",
                            header.id === "date" && "w-[15%]",
                            header.id === "status" && "w-[15%]",
                            header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground/70 transition-colors"
                          )}
                          onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && <SortIcon id={header.id} />}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    key={`table-${directionFilter}-${searchTerm}-${table.getState().pagination.pageIndex}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="divide-y divide-border/20"
                  >
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="group hover:bg-white/[0.01] transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={cn("px-6 py-4", cell.column.id === "amount" && "text-right")}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </motion.tbody>
                </table>

                {/* Mobile Cards */}
                <motion.div
                  key={`cards-${directionFilter}-${searchTerm}-${table.getState().pagination.pageIndex}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="block md:hidden divide-y divide-border/20"
                >
                  {table.getRowModel().rows.map((row) => {
                    const tx = row.original;
                    const name = tx.payee ? getMaskedEntity(tx.payee.displayName) : "Unknown Payee";
                    return (
                      <div key={row.id} className="p-4 space-y-3 hover:bg-white/[0.01] transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn("p-2 rounded-lg border shrink-0", tx.direction === "CREDIT" ? "bg-teal-soft/10 border-teal/20 text-teal" : "bg-white/5 border-white/5 text-foreground/40")}>
                              {tx.direction === "CREDIT" ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                            </div>
                            <span className="text-xs font-semibold text-foreground truncate block" title={name}>{name}</span>
                          </div>
                          <div className="shrink-0 text-right">{formatAmount(tx.amount, tx.direction)}</div>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-[10px] text-foreground/50">
                          <div className="flex items-center gap-2">
                            {tx.payee?.id ? (
                              <CategoryDropdown payeeId={tx.payee.id} currentCategory={tx.payee.category ?? "UNCATEGORIZED"} />
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/5">Uncategorized</span>
                            )}
                            <span className={cn("text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border", tx.status === "SUCCESS" ? "bg-teal-soft/10 border-teal/15 text-teal" : "bg-destructive/10 border-destructive/20 text-destructive")}>
                              {tx.status || "SUCCESS"}
                            </span>
                          </div>
                          <span className="font-sans">
                            {new Date(isNaN(Number(tx.date)) ? tx.date : Number(tx.date)).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Pagination Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/20 bg-panel/20">
                  <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} &mdash; {totals.count} results
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-foreground/60 hover:text-white transition-all"
                      title="First page"
                    >
                      <ChevronsLeft size={15} />
                    </button>
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-foreground/60 hover:text-white transition-all"
                      title="Previous page"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    {/* Page number pills */}
                    {Array.from({ length: table.getPageCount() }, (_, i) => i)
                      .filter((i) => {
                        const curr = table.getState().pagination.pageIndex;
                        return i === 0 || i === table.getPageCount() - 1 || Math.abs(i - curr) <= 1;
                      })
                      .reduce<(number | "ellipsis")[]>((acc, i, idx, arr) => {
                        if (idx > 0 && i - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                        acc.push(i);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "ellipsis" ? (
                          <span key={`e-${idx}`} className="px-1 text-foreground/20 text-xs">…</span>
                        ) : (
                          <button
                            key={item}
                            onClick={() => table.setPageIndex(item)}
                            className={cn(
                              "min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                              table.getState().pagination.pageIndex === item
                                ? "bg-accent text-background shadow-lg shadow-accent/20"
                                : "text-foreground/40 hover:text-foreground/80 hover:bg-white/5"
                            )}
                          >
                            {(item as number) + 1}
                          </button>
                        )
                      )}

                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-foreground/60 hover:text-white transition-all"
                      title="Next page"
                    >
                      <ChevronRight size={15} />
                    </button>
                    <button
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                      className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer text-foreground/60 hover:text-white transition-all"
                      title="Last page"
                    >
                      <ChevronsRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-foreground/20 text-center">
                <Search size={48} strokeWidth={1} className="mb-4 text-foreground/10" />
                <p className="text-sm font-bold text-foreground">No matching transactions found.</p>
                <p className="text-[10px] uppercase tracking-widest mt-1 text-foreground/40 font-sans">
                  Try adjusting your filters or search term
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
