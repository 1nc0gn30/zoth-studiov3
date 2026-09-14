package com.example.zothsignalbridge.ui.screens

import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.repository.NotesDataProvider
import com.example.zothsignalbridge.data.repository.SwarmRepository
import com.example.zothsignalbridge.ui.main.MainScreenViewModel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class NotesReviewerTest {

    @Test
    fun testNotesInitialStateAndDataset() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val notes = viewModel.notes.first()
        assertTrue("Notes list should be populated with at least 8 annotations", notes.size >= 8)

        // Check Open vs Resolved counts
        val openNotes = notes.filter { it.isOpen }
        val resolvedNotes = notes.filter { it.isResolved }

        assertTrue("Should have open notes", openNotes.isNotEmpty())
        assertTrue("Should have resolved notes", resolvedNotes.isNotEmpty())
        assertEquals(notes.size, openNotes.size + resolvedNotes.size)
    }

    @Test
    fun testFilterNotesByPagePathname() = runTest {
        val notes = NotesDataProvider.getInitialNotes()

        val rootNotes = notes.filter { it.pathname == "/" }
        val zothNotes = notes.filter { it.pathname == "/zoth/" }
        val studioNotes = notes.filter { it.pathname == "/studio/swarm.html" }

        assertTrue("Root page notes exist", rootNotes.isNotEmpty())
        assertTrue("Zoth page notes exist", zothNotes.isNotEmpty())
        assertTrue("Studio page notes exist", studioNotes.isNotEmpty())

        // Verify selector and tag in /zoth/
        val archetypesNote = zothNotes.find { it.selector.contains("archetypes") }
        assertNotNull(archetypesNote)
        assertEquals("High", archetypesNote?.priority)
        assertTrue(archetypesNote?.taggedAgents?.contains("hermes") == true)
    }

    @Test
    fun test1TapToggleAnnotationStatus() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val initialNotes = viewModel.notes.first()
        val openNote = initialNotes.find { it.isOpen }
        assertNotNull(openNote)
        val noteId = openNote!!.id

        // 1-Tap Toggle: Open -> Resolved
        viewModel.toggleNoteStatus(noteId)

        val updatedNotes = viewModel.notes.first()
        val toggledNote = updatedNotes.find { it.id == noteId }
        assertNotNull(toggledNote)
        assertTrue("Note should now be resolved", toggledNote!!.isResolved)
        assertFalse("Note should no longer be open", toggledNote.isOpen)
        assertEquals(NoteStatus.APPROVED, toggledNote.status)
        assertEquals("@operator", toggledNote.resolvedBy)
        assertNotNull(toggledNote.resolvedAt)

        // 1-Tap Toggle again: Resolved -> Open (Reopen)
        viewModel.toggleNoteStatus(noteId)

        val reopenedNotes = viewModel.notes.first()
        val reopenedNote = reopenedNotes.find { it.id == noteId }
        assertNotNull(reopenedNote)
        assertTrue("Note should now be reopened", reopenedNote!!.isOpen)
        assertFalse("Note should not be resolved", reopenedNote.isResolved)
        assertEquals(NoteStatus.IN_REVIEW, reopenedNote.status)
    }

    @Test
    fun testResolveAndReopenExplicitMethods() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val noteId = "zn-1787465034685-fw8n"
        
        viewModel.resolveNote(noteId, "@antigravity")
        var note = viewModel.notes.first().find { it.id == noteId }
        assertNotNull(note)
        assertTrue(note!!.isResolved)
        assertEquals("@antigravity", note.resolvedBy)

        viewModel.reopenNote(noteId)
        note = viewModel.notes.first().find { it.id == noteId }
        assertNotNull(note)
        assertTrue(note!!.isOpen)
    }

    @Test
    fun testDispatchQuickReplyToSwarm() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val initialMsgCount = viewModel.messages.first().size
        val noteId = "zn-1787465440177-yp63"
        val replyInstruction = "⚡ Inspecting DOM node #alchemical-doctrine and adjusting CSS layout"

        viewModel.dispatchAnnotationReply(
            noteId = noteId,
            targetAgent = "hermes",
            replyText = replyInstruction,
            priority = "high"
        )

        val updatedMsgs = viewModel.messages.first()
        assertTrue("Outbound message should be added to transmissions", updatedMsgs.size > initialMsgCount)
        val latestMsg = updatedMsgs.first()
        assertEquals("operator", latestMsg.from)
        assertEquals("hermes", latestMsg.to)
        assertEquals(replyInstruction, latestMsg.message)
        assertEquals("high", latestMsg.priority)
        assertTrue(latestMsg.isOutbound)
    }

    @Test
    fun testCreateNewAnnotationNote() = runTest {
        val repo = SwarmRepository()
        val viewModel = MainScreenViewModel(repo)

        val initialCount = viewModel.notes.first().size
        viewModel.createNote(
            title = "Navbar Alignment Glitch",
            author = "operator",
            content = "Align logo to 48px baseline",
            tags = listOf("UI", "Navbar")
        )

        val updatedNotes = viewModel.notes.first()
        assertEquals(initialCount + 1, updatedNotes.size)
        val created = updatedNotes.first()
        assertTrue(created.id.startsWith("zn-"))
        assertEquals(NoteStatus.IN_REVIEW, created.status)
        assertEquals("Align logo to 48px baseline", created.text)
    }
}
