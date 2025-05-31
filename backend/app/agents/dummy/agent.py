"""
Dummy agent implementation for testing and demonstration
"""
import time
from typing import Dict, Any
from ..base import Agent, AgentConfig, AgentState


class DummyAgent(Agent):
    """A simple dummy agent for testing purposes"""
    
    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.responses = [
            "I understand your request.",
            "Let me think about that...",
            "That's an interesting question.",
            "I'll help you with that.",
            "Here's what I can do for you."
        ]
        self.response_index = 0
    
    async def step(self, message: str) -> Dict[str, Any]:
        """Execute one step of the dummy agent"""
        self.state = AgentState.THINKING
        self.stats["messages_sent"] += 1
        
        # Simulate processing time
        await self._simulate_thinking()
        
        # Cycle through responses
        response_text = self.responses[self.response_index % len(self.responses)]
        self.response_index += 1
        
        response = {
            "agent_type": "dummy",
            "thought": f"Processing message: {message[:50]}...",
            "action": "respond",
            "response": response_text,
            "message_length": len(message),
            "iteration": self.iteration
        }
        
        self.iteration += 1
        self.stats["actions_taken"] += 1
        
        self.state = AgentState.IDLE
        return response
    
    async def _simulate_thinking(self):
        """Simulate agent thinking time"""
        import asyncio
        await asyncio.sleep(0.3)  # Faster for dummy agent
    
    def get_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        stats = super().get_stats()
        stats.update({
            "responses_given": self.response_index,
            "agent_type": "dummy"
        })
        return stats
