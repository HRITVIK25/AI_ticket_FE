import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Dialog,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
import { api } from "../../hooks/useAxios";
// ─────────────────────────────────────────────
// TicketDetailModal — displays ticket details and chat
// ─────────────────────────────────────────────
const TicketDetailModal = ({
  ticket: initialTicket,
  open,
  onClose,
  isGeneratingAi = false,
  onTicketUpdated,
  isAdmin = false,
}) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const needsPolling = useCallback((t) => !t?.ai_response, []);
  const isAssigned = ticket?.status === "ASSIGNED";

  const updateStatus = useCallback(
    async (newStatus) => {
      if (!ticket?.id) return;
      setStatusUpdating(newStatus);
      try {
        const res = await api.post(`api/v1/tickets/${ticket.id}/${newStatus}`);
        const updated = res.data || { ...ticket, status: newStatus };
        setTicket(updated);
        onTicketUpdated?.(updated);
        if (newStatus === "CLOSED") onClose();
      } catch (err) {
        console.error("Failed to update ticket status:", err);
      } finally {
        setStatusUpdating(null);
      }
    },
    [ticket, onTicketUpdated, onClose],
  );

  const sendMessage = useCallback(async () => {
    const text = chatMessage.trim();
    if (!text || isSending || !ticket?.id) return;

    const optimisticMsg = {
      message: text,
      senderRole: "agent",
      createdAt: new Date().toISOString(),
    };
    setTicket((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), optimisticMsg],
    }));
    setChatMessage("");
    setIsSending(true);

    try {
      const res = await api.post(`api/v1/tickets/${ticket.id}/messages`, {
        message: text,
      });
      if (res.data) {
        setTicket(res.data);
        onTicketUpdated?.(res.data);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setTicket((prev) => ({
        ...prev,
        messages: (prev.messages || []).filter((m) => m !== optimisticMsg),
      }));
    } finally {
      setIsSending(false);
      chatInputRef.current?.focus();
    }
  }, [chatMessage, isSending, ticket, onTicketUpdated]);

  // Sync when parent ticket changes (e.g. different ticket opened)
  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const isSystem = (role) =>
    role === "system" || role === "AI" || role === "ai";
  const isCustomer = (role) => role === "customer";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: "#0f172a",
          color: "#f1f5f9",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.7)",
          overflow: "hidden",
          height: { xs: "auto", md: "75vh" },
        },
      }}
    >
      {ticket && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            height: "100%",
          }}
        >
          {/* LEFT PANEL */}
          <Box
            sx={{
              width: { xs: "100%", md: "36%" },
              borderRight: { md: "1px solid rgba(255, 255, 255, 0.08)" },
              borderBottom: {
                xs: "1px solid rgba(255, 255, 255, 0.08)",
                md: "none",
              },
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              overflowY: "auto",
              background: "rgba(15, 23, 42, 0.8)",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              >
                Ticket
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#f1f5f9",
                  fontWeight: 700,
                  mt: 0.5,
                  lineHeight: 1.3,
                }}
              >
                {ticket.title}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              >
                Status &amp; Tag
              </Typography>
              <Box sx={{ mt: 0.75, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={ticket.status || "CREATED"}
                  size="small"
                  sx={{
                    bgcolor: "rgba(59, 130, 246, 0.15)",
                    color: "#60a5fa",
                    fontWeight: 700,
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                />
                {ticket.tag && (
                  <Chip
                    label={ticket.tag}
                    size="small"
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.15)",
                      color: "#34d399",
                      fontWeight: 700,
                      border: "1px solid rgba(16,185,129,0.3)",
                    }}
                  />
                )}
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              >
                Assigned To
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                {ticket.assigned_to || "Unassigned"}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.06)" }} />

            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: 600,
                }}
              >
                Initial Description
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#cbd5e1",
                  mt: 0.75,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {ticket.description}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: "auto",
                pt: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {isAdmin && ticket.status !== "CLOSED" && (
                <Button
                  onClick={() => updateStatus("CLOSED")}
                  fullWidth
                  variant="contained"
                  disabled={statusUpdating === "CLOSED"}
                  startIcon={
                    statusUpdating === "CLOSED" ? (
                      <CircularProgress size={16} sx={{ color: "#fff" }} />
                    ) : (
                      <CheckCircleOutlineIcon />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "#fff",
                    boxShadow: "0 4px 15px -3px rgba(16, 185, 129, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #059669, #047857)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 20px -4px rgba(16, 185, 129, 0.5)",
                    },
                    "&.Mui-disabled": { opacity: 0.7 },
                  }}
                >
                  Close Ticket
                </Button>
              )}
              <Button
                onClick={onClose}
                fullWidth
                variant="outlined"
                sx={{
                  color: "#94a3b8",
                  borderColor: "rgba(148, 163, 184, 0.2)",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "10px",
                  "&:hover": {
                    borderColor: "#60a5fa",
                    color: "#60a5fa",
                    background: "rgba(59,130,246,0.05)",
                  },
                }}
              >
                Close Window
              </Button>
            </Box>
          </Box>

          {/* RIGHT PANEL — Chat */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                background: "rgba(30, 41, 59, 0.5)",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#f1f5f9" }}
              >
                Conversation
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {ticket.messages?.length || 0} message
                {ticket.messages?.length !== 1 ? "s" : ""}
                {needsPolling(ticket) && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1.5,
                      color: "#10b981",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#10b981",
                        animation: "dot-pulse 1.2s ease-in-out infinite",
                        "@keyframes dot-pulse": {
                          "0%,100%": { opacity: 0.3 },
                          "50%": { opacity: 1 },
                        },
                      }}
                    />
                    AI responding…
                  </Box>
                )}
              </Typography>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Agent availability notice — shown to customers (non-admin) when ticket is ASSIGNED */}
              {isAssigned && !isAdmin && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    px: 2.5,
                    py: 1.8,
                    borderRadius: "14px",
                    background: "rgba(245, 158, 11, 0.07)",
                    border: "1px solid rgba(245, 158, 11, 0.18)",
                    mb: 1,
                  }}
                >
                  <AccessTimeIcon
                    sx={{
                      color: "#f59e0b",
                      fontSize: "1.1rem",
                      mt: "1px",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "#fbbf24", lineHeight: 1.6 }}
                  >
                    Your ticket has been assigned to a support agent. They will
                    reply as soon as possible — response times may vary based on
                    agent availability.
                  </Typography>
                </Box>
              )}

              {(!ticket.messages || ticket.messages.length === 0) &&
                !needsPolling(ticket) && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      No messages yet.
                    </Typography>
                  </Box>
                )}

              {ticket.messages?.map((msg, idx) => {
                const isAI = isSystem(msg.senderRole);
                const isCust = isCustomer(msg.senderRole);
                const isAgent =
                  msg.senderRole === "ticket_admin" ||
                  msg.senderRole === "admin";
                const initials =
                  msg.senderRole?.slice(0, 2).toUpperCase() || "??";
                const time = msg.createdAt
                  ? new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 1.5,
                      flexDirection: isCust ? "row-reverse" : "row",
                    }}
                  >
                    {/* Avatar */}
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        background: isAI
                          ? "linear-gradient(135deg, #10b981, #06b6d4)"
                          : isAgent
                            ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                            : "linear-gradient(135deg, #3b82f6, #6366f1)",
                        color: "#fff",
                      }}
                    >
                      {isAI ? "AI" : isAgent ? "AG" : initials}
                    </Box>
                    {/* Bubble */}
                    <Box sx={{ maxWidth: "70%" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748b",
                          display: "block",
                          mb: 0.4,
                          textAlign: isCust ? "right" : "left",
                        }}
                      >
                        {isAI
                          ? "AI Assistant"
                          : isAgent
                            ? "Support Agent"
                            : "You"}{" "}
                        · {time}
                      </Typography>
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderRadius: isCust
                            ? "16px 16px 4px 16px"
                            : "16px 16px 16px 4px",
                          background: isCust
                            ? "linear-gradient(135deg, #3b82f6, #6366f1)"
                            : isAgent
                              ? "rgba(245,158,11,0.09)"
                              : isAI
                                ? "rgba(16, 185, 129, 0.08)"
                                : "rgba(30, 41, 59, 0.8)",
                          border: isCust
                            ? "none"
                            : isAgent
                              ? "1px solid rgba(245,158,11,0.25)"
                              : isAI
                                ? "1px solid rgba(16, 185, 129, 0.2)"
                                : "none",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: isCust
                              ? "#fff"
                              : isAgent
                                ? "#fcd34d"
                                : "#cbd5e1",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {msg.message}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}

              {/* Pending AI typing indicator */}
              {needsPolling(ticket) && (
                <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #10b981, #06b6d4)",
                      color: "#fff",
                    }}
                  >
                    AI
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block", mb: 0.4 }}
                    >
                      AI Assistant
                    </Typography>
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: "16px 16px 16px 4px",
                        background: "rgba(16, 185, 129, 0.05)",
                        border: "1px dashed rgba(16, 185, 129, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                      >
                        {[0, 1, 2].map((i) => (
                          <Box
                            key={i}
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#10b981",
                              animation: "pulse 1.4s ease-in-out infinite",
                              animationDelay: `${i * 0.2}s`,
                              "@keyframes pulse": {
                                "0%, 80%, 100%": {
                                  opacity: 0.2,
                                  transform: "scale(0.8)",
                                },
                                "40%": { opacity: 1, transform: "scale(1)" },
                              },
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#6ee7b7", fontStyle: "italic" }}
                      >
                        {isGeneratingAi
                          ? "Generating response right now... please wait"
                          : "Kindly check back shortly — automated response getting generated"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Box>

            {/* Admin chat input — shown when admin views an ASSIGNED ticket */}
            {isAssigned && isAdmin && (
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  borderTop: "1px solid rgba(99,102,241,0.15)",
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.7), rgba(10,18,30,0.9))",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#475569", display: "block", mb: 1, pl: 0.5 }}
                >
                  Reply as support agent
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
                  <TextField
                    inputRef={chatInputRef}
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type your reply…"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        background: "rgba(30,41,59,0.5)",
                        color: "#f1f5f9",
                        fontSize: "0.9rem",
                        "& fieldset": { borderColor: "rgba(99,102,241,0.2)" },
                        "&:hover fieldset": {
                          borderColor: "rgba(99,102,241,0.4)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "rgba(99,102,241,0.6)",
                        },
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#475569",
                        opacity: 1,
                      },
                    }}
                  />
                  <IconButton
                    onClick={sendMessage}
                    disabled={!chatMessage.trim() || isSending}
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      background:
                        chatMessage.trim() && !isSending
                          ? "linear-gradient(135deg, #6366f1, #3b82f6)"
                          : "rgba(30,41,59,0.5)",
                      color:
                        chatMessage.trim() && !isSending ? "#fff" : "#475569",
                      borderRadius: "12px",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: chatMessage.trim() ? "scale(1.08)" : "none",
                        background:
                          chatMessage.trim() && !isSending
                            ? "linear-gradient(135deg, #4f46e5, #2563eb)"
                            : "rgba(30,41,59,0.5)",
                      },
                      "&.Mui-disabled": { opacity: 0.4 },
                    }}
                  >
                    {isSending ? (
                      <CircularProgress size={18} sx={{ color: "#6366f1" }} />
                    ) : (
                      <SendIcon sx={{ fontSize: "1.1rem" }} />
                    )}
                  </IconButton>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#334155", display: "block", mt: 0.75, pl: 0.5 }}
                >
                  Enter to send · Shift+Enter for new line
                </Typography>
              </Box>
            )}

            {/* Action buttons — shown once AI has replied, ticket not closed, and not in admin-reply mode */}
            {!needsPolling(ticket) &&
              !isGeneratingAi &&
              ticket.status !== "CLOSED" &&
              !isAssigned && (
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(15,23,42,0.6)",
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      statusUpdating === "CLOSED" ? (
                        <CircularProgress size={14} sx={{ color: "#94a3b8" }} />
                      ) : (
                        <CheckCircleOutlineIcon />
                      )
                    }
                    disabled={!!statusUpdating}
                    onClick={() => updateStatus("CLOSED")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "12px",
                      color: "#94a3b8",
                      borderColor: "rgba(148,163,184,0.25)",
                      "&:hover": {
                        borderColor: "#94a3b8",
                        background: "rgba(148,163,184,0.08)",
                        color: "#f1f5f9",
                      },
                      "&.Mui-disabled": { opacity: 0.5 },
                    }}
                  >
                    Close Ticket
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      statusUpdating === "ASSIGNED" ? (
                        <CircularProgress size={14} sx={{ color: "#fff" }} />
                      ) : (
                        <EscalatorWarningIcon />
                      )
                    }
                    disabled={!!statusUpdating}
                    onClick={() => updateStatus("ASSIGNED")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                      color: "#fff",
                      boxShadow: "0 4px 15px -3px rgba(239,68,68,0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #d97706, #dc2626)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 8px 20px -4px rgba(239,68,68,0.5)",
                      },
                      "&.Mui-disabled": { opacity: 0.5 },
                      transition: "all 0.2s",
                    }}
                  >
                    Escalate Ticket
                  </Button>
                </Box>
              )}
          </Box>
        </Box>
      )}
    </Dialog>
  );
};

export default TicketDetailModal;
