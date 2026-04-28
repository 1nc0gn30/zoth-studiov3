import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import ToolDashboard from './ToolDashboard'

describe('ToolDashboard', () => {
  test('renders tools and triggers callbacks', () => {
    const onSearchChange = vi.fn()
    const onOpenNative = vi.fn()
    const onToggleAI = vi.fn()
    const onFilterChange = vi.fn()
    const onOpenWorkspace = vi.fn()

    render(
      <ToolDashboard
        searchTerm=""
        onSearchChange={onSearchChange}
        onOpenNative={onOpenNative}
        onToggleAI={onToggleAI}
        currentFilter="All"
        categories={['All', 'Intelligence']}
        onFilterChange={onFilterChange}
        filteredTools={[
          { name: 'codex', category: 'Intelligence', command: 'codex' },
          { name: 'nmap', category: 'Information Gathering', command: 'nmap' }
        ]}
        onOpenWorkspace={onOpenWorkspace}
      />
    )

    fireEvent.change(screen.getByPlaceholderText(/Search tools/i), {
      target: { value: 'co' }
    })
    expect(onSearchChange).toHaveBeenCalledWith('co')

    fireEvent.click(screen.getByText('NATIVE TERMINAL'))
    expect(onOpenNative).toHaveBeenCalled()

    fireEvent.click(screen.getByText('AI ASSISTANT'))
    expect(onToggleAI).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Intelligence' }))
    expect(onFilterChange).toHaveBeenCalledWith('Intelligence')

    fireEvent.click(screen.getByText('codex'))
    expect(onOpenWorkspace).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'codex' })
    )
  })
})
