'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { generatePagination } from '@/app/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Helper to build page URLs
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // generatePagination returns an array of page numbers (or strings like '...')
  const allPages = generatePagination(currentPage, totalPages);

  if (totalPages <= 1) return null; // don't render if only 1 page

  return (
    <div className="flex -space-x-px">
      {/* Previous button */}
      <Link
        href={createPageURL(Math.max(1, currentPage - 1))}
        className={clsx(
          'p-2 border rounded-l-md',
          currentPage === 1 && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </Link>

      {/* Page numbers */}
      {allPages.map((page, index) => {
        const isActive = page === currentPage;
        return typeof page === 'number' ? (
          <Link
            key={index}
            href={createPageURL(page)}
            className={clsx(
              'p-2 border',
              isActive ? 'bg-blue-500 text-white' : 'bg-white text-black'
            )}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="p-2 border bg-white cursor-default">
            {page} {/* this would be "..." */}
          </span>
        );
      })}

      {/* Next button */}
      <Link
        href={createPageURL(Math.min(totalPages, currentPage + 1))}
        className={clsx(
          'p-2 border rounded-r-md',
          currentPage === totalPages && 'opacity-50 cursor-not-allowed'
        )}
      >
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>
  );
}
