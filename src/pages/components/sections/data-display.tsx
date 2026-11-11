import { ComponentCard } from '@/components/shared/component-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronDownIcon, PencilIcon, TrashBinIcon } from '@/icons'
import type { useComponentsModel } from '../model'

type Props = Pick<ReturnType<typeof useComponentsModel>, 'page' | 'handlePageChange'>

const ORDERS = [
  { id: '#1042', customer: 'Ana Souza', amount: 'R$ 1.280,00', status: 'Paid' },
  { id: '#1041', customer: 'Bruno Lima', amount: 'R$ 349,90', status: 'Pending' },
  { id: '#1040', customer: 'Carla Mendes', amount: 'R$ 2.015,50', status: 'Paid' },
  { id: '#1039', customer: 'Diego Alves', amount: 'R$ 89,00', status: 'Canceled' },
] as const

const STATUS_COLOR = { Paid: 'success', Pending: 'warning', Canceled: 'error' } as const

export function DataDisplaySection({ page, handlePageChange }: Props) {
  return (
    <>
      <ComponentCard
        title="Table"
        description="Rows, status badges and pagination."
        className="space-y-4"
      >
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <Table>
            <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/2">
              <TableRow>
                {['Order', 'Customer', 'Amount', 'Status'].map((h) => (
                  <TableCell
                    key={h}
                    isHeader
                    className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {ORDERS.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-3.5 text-sm font-medium text-gray-800 dark:text-white/90">
                    {order.id}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                    {order.customer}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-sm text-gray-600 dark:text-gray-400">
                    {order.amount}
                  </TableCell>
                  <TableCell className="px-5 py-3.5">
                    <Badge size="sm" color={STATUS_COLOR[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                size="icon"
                variant="outline"
                text=""
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.max(1, page - 1))
                }}
              />
            </PaginationItem>
            {[1, 2, 3].map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  size="icon"
                  variant="outline"
                  isActive={page === n}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(n)
                  }}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                size="icon"
                variant="outline"
                text=""
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.min(3, page + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </ComponentCard>

      <ComponentCard title="Overlays" description="Dialog, dropdown and tooltip.">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button>Open dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete project?</DialogTitle>
                <DialogDescription>
                  This action can&apos;t be undone. All tasks in this project will be removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <DialogClose render={<Button variant="destructive">Delete</Button>} />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Actions
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-48">
              <DropdownMenuItem>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <TrashBinIcon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost">Hover me</Button>} />
            <TooltipContent>Tooltips explain icons and actions</TooltipContent>
          </Tooltip>
        </div>
      </ComponentCard>

      <ComponentCard title="Tabs & accordion">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4 text-sm text-gray-500 dark:text-gray-400">
            Summary of the project with its key numbers.
          </TabsContent>
          <TabsContent value="activity" className="pt-4 text-sm text-gray-500 dark:text-gray-400">
            Latest updates made by your team.
          </TabsContent>
          <TabsContent value="settings" className="pt-4 text-sm text-gray-500 dark:text-gray-400">
            Preferences, members and integrations.
          </TabsContent>
        </Tabs>

        <Accordion>
          {[
            ['How do I change the brand color?', 'Edit the brand-* scale in src/styles/theme.css.'],
            ['Where do menu items live?', 'In components/layout/app-layout/sidebar/data.tsx.'],
            ['Does it support dark mode?', 'Yes, every component ships with dark: styles.'],
          ].map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent className="text-gray-500 dark:text-gray-400">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ComponentCard>
    </>
  )
}
