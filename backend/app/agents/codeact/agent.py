"""
Code-acting agent implementation
"""
import time
from typing import Dict, Any
from ..base import Agent, AgentConfig, AgentState


class CodeActAgent(Agent):
    """Agent that can write and execute code"""
    
    def __init__(self, config: AgentConfig):
        super().__init__(config)
        self.code_history = []
    
    async def step(self, message: str) -> Dict[str, Any]:
        """Execute one step of the code agent"""
        self.state = AgentState.THINKING
        self.stats["messages_sent"] += 1
        
        # Simulate processing time
        await self._simulate_thinking()
        
        response = {
            "agent_type": "codeact",
            "thought": f"Analyzing request: {message[:100]}...",
            "action": "code_generation",
            "code": f"# Generated code for: {message}\nprint('Hello from CodeAct agent!')",
            "result": "Code generated successfully",
            "iteration": self.iteration
        }
        
        self.iteration += 1
        self.stats["actions_taken"] += 1
        self.code_history.append(response["code"])
        
        self.state = AgentState.IDLE
        return response
    
    async def _simulate_thinking(self):
        """Simulate agent thinking time"""
        import asyncio
        await asyncio.sleep(0.5)  # Simulate processing
    
    def get_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        stats = super().get_stats()
        stats.update({
            "code_blocks_generated": len(self.code_history),
            "agent_type": "codeact"
        })
        return stats
