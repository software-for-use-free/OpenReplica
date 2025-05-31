"""
Web browsing agent implementation
"""
import time
from typing import Dict, Any
from ..base import Agent, AgentConfig, AgentState


class BrowsingAgent(Agent):
    """Agent that can browse and interact with web content"""
    
    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.browsing_history = []
        self.current_url = None
    
    async def step(self, message: str) -> Dict[str, Any]:
        """Execute one step of the browsing agent"""
        self.state = AgentState.THINKING
        self.stats["messages_sent"] += 1
        
        # Simulate processing time
        await self._simulate_thinking()
        
        # Simulate web browsing action
        if "visit" in message.lower() or "go to" in message.lower():
            url = self._extract_url(message)
            action = "navigate"
            result = f"Navigated to {url}"
            self.current_url = url
            self.browsing_history.append(url)
        elif "search" in message.lower():
            action = "search"
            result = f"Searched for: {message.replace('search', '').strip()}"
        else:
            action = "analyze"
            result = f"Analyzed current page content"
        
        response = {
            "agent_type": "browsing",
            "thought": f"Processing web request: {message[:100]}...",
            "action": action,
            "current_url": self.current_url,
            "result": result,
            "iteration": self.iteration
        }
        
        self.iteration += 1
        self.stats["actions_taken"] += 1
        
        self.state = AgentState.IDLE
        return response
    
    def _extract_url(self, message: str) -> str:
        """Extract URL from message or generate a default one"""
        # Simple URL extraction (in real implementation, use regex)
        words = message.split()
        for word in words:
            if "http" in word or ".com" in word or ".org" in word:
                return word
        return "https://example.com"
    
    async def _simulate_thinking(self):
        """Simulate agent thinking time"""
        import asyncio
        await asyncio.sleep(0.5)  # Simulate processing
    
    def get_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        stats = super().get_stats()
        stats.update({
            "pages_visited": len(self.browsing_history),
            "current_url": self.current_url,
            "agent_type": "browsing"
        })
        return stats
